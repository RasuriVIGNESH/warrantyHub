package com.warrantyhub.repository;

import com.warrantyhub.model.Device;
import com.warrantyhub.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    /**
     * Count documents for a specific device
     */
    int countByDevice(Device device);

    /**
     * Find all documents for a specific device
     */
    List<Document> findByDevice(Device device);

    /**
     * Find documents by device and user (for security validation)
     */
    @Query("SELECT d FROM Document d WHERE d.device.id = :deviceId AND d.device.user.id = :userId")
    List<Document> findByDeviceIdAndUserId(@Param("deviceId") Long deviceId, @Param("userId") Long userId);

    /**
     * Find a specific document by ID and user (for security validation)
     */
    @Query("SELECT d FROM Document d WHERE d.id = :documentId AND d.device.user.id = :userId")
    Optional<Document> findByIdAndUserId(@Param("documentId") Long documentId, @Param("userId") Long userId);

    /**
     * Find documents by device ID and user ID with pagination support
     */
    @Query("SELECT d FROM Document d WHERE d.device.id = :deviceId AND d.device.user.id = :userId ORDER BY d.uploadDate DESC")
    List<Document> findByDeviceIdAndUserIdOrderByUploadDateDesc(@Param("deviceId") Long deviceId, @Param("userId") Long userId);
}

