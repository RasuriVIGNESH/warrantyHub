package com.warrantyhub.service;

import com.warrantyhub.dto.response.ApiResponse;
import com.warrantyhub.dto.response.DocumentDTO;
import com.warrantyhub.exception.FileStorageException;
import com.warrantyhub.exception.ResourceNotFoundException;
import com.warrantyhub.exception.UnauthorizedException;
import com.warrantyhub.model.Device;
import com.warrantyhub.model.Document;
import com.warrantyhub.model.User;
import com.warrantyhub.repository.DeviceRepository;
import com.warrantyhub.repository.DocumentRepository;
import com.warrantyhub.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Service
public class DocumentService {
    private static final int MAX_DOCUMENTS = 3;
    private static final long MAX_BYTES = 10 * 1024 * 1024;
    private final DocumentRepository documents;
    private final DeviceRepository devices;
    private final UserRepository users;
    private final CloudinaryService storage;

    public DocumentService(DocumentRepository documents, DeviceRepository devices, UserRepository users, CloudinaryService storage) {
        this.documents = documents; this.devices = devices; this.users = users; this.storage = storage;
    }

    @Transactional
    public DocumentDTO upload(Long deviceId, MultipartFile file, Authentication auth) {
        Device device = ownedDevice(deviceId, auth);
        if (file == null || file.isEmpty()) throw new FileStorageException("File is required");
        if (file.getSize() > MAX_BYTES) throw new FileStorageException("File must be 10 MB or smaller");
        if (documents.countByDevice(device) >= MAX_DOCUMENTS) throw new FileStorageException("Maximum of 3 documents per device");
        String name = StringUtils.cleanPath(file.getOriginalFilename() == null ? "document" : file.getOriginalFilename());
        if (name.contains("..")) throw new FileStorageException("Invalid file name");
        try {
            String url = storage.uploadFile(file);
            Document saved = documents.save(new Document(name, url, url, file.getContentType(), file.getSize(), LocalDate.now(), device));
            return toDto(saved);
        } catch (Exception e) {
            throw new FileStorageException("Could not upload document", e);
        }
    }

    @Transactional(readOnly = true)
    public List<DocumentDTO> list(Long deviceId, Authentication auth) {
        User user = currentUser(auth);
        Device device = devices.findById(deviceId).orElseThrow(() -> new ResourceNotFoundException("Device not found"));
        requireOwner(device, user);
        return documents.findByDeviceIdAndUserId(deviceId, user.getId()).stream().map(this::toDto).toList();
    }

    @Transactional
    public ApiResponse delete(Long deviceId, Long documentId, Authentication auth) {
        Device device = ownedDevice(deviceId, auth);
        Document document = documents.findById(documentId).orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        if (!document.getDevice().getId().equals(device.getId())) throw new UnauthorizedException("Access denied");
        try { storage.deleteFileByUrl(document.getStorageKey()); documents.delete(document); }
        catch (Exception e) { throw new FileStorageException("Could not delete document", e); }
        return new ApiResponse(true, "Document deleted successfully");
    }

    private DocumentDTO toDto(Document d) { return new DocumentDTO(String.valueOf(d.getId()), d.getName(), d.getFileType(), d.getFileUrl(), d.getFileSize(), d.getUploadDate()); }
    private Device ownedDevice(Long id, Authentication auth) { Device d = devices.findById(id).orElseThrow(() -> new ResourceNotFoundException("Device not found")); requireOwner(d, currentUser(auth)); return d; }
    private User currentUser(Authentication auth) { return users.findByEmail(auth.getName().toLowerCase()).orElseThrow(() -> new ResourceNotFoundException("User not found")); }
    private void requireOwner(Device d, User u) { if (!d.getUser().getId().equals(u.getId())) throw new UnauthorizedException("Access denied"); }
}
