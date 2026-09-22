package com.warrantyhub.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.warrantyhub.exception.FileStorageException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class CloudinaryService {

    private Cloudinary cloudinary;

    @Autowired
    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadFile(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "raw",
                            "folder", "documents"
                    )
            );
            
            Object secureUrl = uploadResult.get("secure_url");
            if (secureUrl == null) {
                throw new FileStorageException("Cloudinary upload response missing secure_url field");
            }
            
            return secureUrl.toString();
        } catch (FileStorageException e) {
            throw e;
        } catch (Exception e) {
            throw new FileStorageException("Failed to upload file to Cloudinary", e);
        }
    }

    public Map uploadFileWithDetails(MultipartFile file) {
        try {
            return cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "auto",
                            "type", "upload",
                            "folder", "documents"
                    )
            );
        } catch (Exception e) {
            throw new FileStorageException("Failed to upload file", e);
        }
    }
    
    public void deleteFile(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            throw new FileStorageException("Failed to delete file from Cloudinary", e);
        }
    }

    public String extractPublicId(String fileUrl) {
        try {
            String[] parts = fileUrl.split("/");
            String fileName = parts[parts.length - 1]; // file.jpg

            String publicIdWithoutExtension =
                    fileName.substring(0, fileName.lastIndexOf("."));

            // if using folder "documents"
            return "documents/" + publicIdWithoutExtension;

        } catch (Exception e) {
            throw new FileStorageException("Failed to extract public_id", e);
        }
    }

    public void deleteFileByUrl(String fileUrl) {
        String publicId = extractPublicId(fileUrl);
        deleteFile(publicId);
    }
}