package com.warrantyhub.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "documents")
public class Document {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    @Column(nullable = false, length = 1000) private String fileUrl;
    @Column(nullable = false, length = 255) private String storageKey;
    @Column(nullable = false) private String fileType;
    @Column(nullable = false) private Long fileSize;
    @Column(nullable = false) private LocalDate uploadDate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    public Document(String name, String fileUrl, String storageKey, String fileType,
                    Long fileSize, LocalDate uploadDate, Device device) {
        this.name = name;
        this.fileUrl = fileUrl;
        this.storageKey = storageKey;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.uploadDate = uploadDate;
        this.device = device;
    }
}
