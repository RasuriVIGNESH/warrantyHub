package com.warrantyhub.model;

import com.warrantyhub.model.enums.Status;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "devices", indexes = {
        @Index(name = "idx_device_user_id", columnList = "user_id"),
        @Index(name = "idx_device_warranty_end_date", columnList = "warranty_end_date"),
        @Index(name = "idx_device_user_status", columnList = "user_id,warranty_status")
})
public class Device {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    private String type;
    private String category;
    private String manufacturer;
    private String model;
    private String serialNumber;
    private LocalDate purchaseDate;
    private LocalDate warrantyEndDate;
    private Integer warrantyDuration;
    private String warrantyUnit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status warrantyStatus = Status.PENDING;

    private String warrantyProvider;
    private BigDecimal purchasePrice;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<MaintenanceRecord> maintenanceHistory = new HashSet<>();

    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Document> documents = new ArrayList<>();

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public void updateWarrantyStatus() {
        if (warrantyEndDate == null) {
            warrantyStatus = Status.PENDING;
            return;
        }
        LocalDate today = LocalDate.now();
        if (warrantyEndDate.isBefore(today)) warrantyStatus = Status.EXPIRED;
        else if (!warrantyEndDate.isAfter(today.plusDays(30))) warrantyStatus = Status.EXPIRING_SOON;
        else warrantyStatus = Status.ACTIVE;
    }
}
