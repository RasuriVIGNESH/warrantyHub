package com.warrantyhub.service;

import com.warrantyhub.dto.response.ApiResponse;
import com.warrantyhub.dto.response.DocumentDTO;
import com.warrantyhub.model.Device;
import com.warrantyhub.model.Document;
import com.warrantyhub.model.User;
import com.warrantyhub.exception.FileStorageException;
import com.warrantyhub.exception.ResourceNotFoundException;
import com.warrantyhub.exception.UnauthorizedException;
import com.warrantyhub.repository.DeviceRepository;
import com.warrantyhub.repository.DocumentRepository;
import com.warrantyhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
public class DocumentService{

    @Autowired
    private final DocumentRepository documentRepository;

    @Autowired
    private final DeviceRepository deviceRepository;

    @Autowired
    private final UserRepository userRepository;


    private final CloudinaryService cloudinaryService;

    // Maximum documents per device (configurable)
    private static final int MAX_DOCUMENTS_PER_DEVICE = 3;

    // Maximum file size (10MB)
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    @Autowired
    public DocumentService(
            DocumentRepository documentRepository,
            DeviceRepository deviceRepository,
            UserRepository userRepository, CloudinaryService cloudinaryService) {
        this.documentRepository = documentRepository;
        this.deviceRepository = deviceRepository;
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
    }


    public DocumentDTO uploadDocument(Long deviceId, MultipartFile file, Authentication authentication) {

        User user = getUserFromAuthentication(authentication);

        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with id: " + deviceId));


        if (!device.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You don't have permission to upload documents to this device");
        }


        int currentDocumentCount = documentRepository.countByDevice(device);
        if (currentDocumentCount >= MAX_DOCUMENTS_PER_DEVICE) {
            throw new FileStorageException(
                    "Maximum number of documents (" + MAX_DOCUMENTS_PER_DEVICE + ") reached for this device");
        }

        if (file == null || file.isEmpty()) {
            throw new FileStorageException("Cannot upload empty file");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileStorageException(
                    "File size exceeds maximum allowed size of " + (MAX_FILE_SIZE / (1024 * 1024)) + "MB");
        }

        String originalFileName = StringUtils.cleanPath(
                Objects.requireNonNull(file.getOriginalFilename()));

        if (originalFileName.contains("..")) {
            throw new FileStorageException("Invalid file name: " + originalFileName);
        }

        try {
            String fileUrl = cloudinaryService.uploadFile(file);
            Document document = new Document(
                    originalFileName,
                    fileUrl,
                    file.getContentType(),
                    file.getSize(),
                    LocalDate.now(),
                    device
            );


            Document savedDocument = documentRepository.save(document);

            DocumentDTO documentDTO = new DocumentDTO(
                    savedDocument.getId().toString(),
                    savedDocument.getName(),
                    savedDocument.getFileURL(),
                    savedDocument.getFileType(),
                    savedDocument.getFileSize(),
                    savedDocument.getUploadDate()
            );

            return documentDTO;

        }catch (Exception ex) {
            ex.printStackTrace();
            throw new FileStorageException("Could not upload file " + originalFileName, ex);
        }
    }

//    @Override
//    public MultipartFile downloadDocument(Long documentId, Authentication authentication) {
//        User user = getUserFromAuthentication(authentication);
//
//        Document document = documentRepository.findByIdAndUserId(documentId, user.getId())
//                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId + " or you don't have permission to access it"));
//
//        try {
//            MultipartFile file = cloudinaryService.downloadFile(document.getFileURL());
//            return file;
//        } catch (Exception ex) {
//            throw new FileStorageException("Could not download file: " + document.getName(), ex);
//        }
//    }


    public ApiResponse deleteDocument(Long deviceId, Long documentId, Authentication authentication) {
        User user = getUserFromAuthentication(authentication);

        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with id: " + deviceId));

        // Check if device belongs to user
        if (!device.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You don't have permission to delete documents from this device");
        }

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));

        // Check if document belongs to device
        if (!document.getDevice().getId().equals(deviceId)) {
            throw new UnauthorizedException("Document does not belong to the specified device");
        }

        // Additional security check: ensure document belongs to the user
        if (!document.getDevice().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You don't have permission to delete this document");
        }

        try {
            // Delete document from database (BLOB content is automatically deleted)
            cloudinaryService.deleteFileByUrl(document.getFileURL());
            documentRepository.delete(document);

            return new ApiResponse(true, "Document deleted successfully");
        } catch (Exception ex) {
            throw new FileStorageException("Could not delete document. Please try again!", ex);
        }
    }

    /**
     * Get all documents for a device (additional utility method)
     */
    public java.util.List<DocumentDTO> getDocumentsByDevice(Long deviceId, Authentication authentication) {
        User user = getUserFromAuthentication(authentication);

        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with id: " + deviceId));

        // Check if device belongs to user
        if (!device.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You don't have permission to view documents for this device");
        }


        // need to change deviceid to doc urls from DB. and call cloudinary service to get the docs
        List<Document> documents =documentRepository.findByDeviceIdAndUserId(deviceId, user.getId());
        return documents.stream()
                .map(doc -> new DocumentDTO(
                        doc.getId().toString(),
                        doc.getName(),
                        doc.getFileURL(),
                        doc.getFileType(),
                        doc.getFileSize(),
                        doc.getUploadDate()
                ))
                .collect(java.util.stream.Collectors.toList());
    }

    private User getUserFromAuthentication(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}

