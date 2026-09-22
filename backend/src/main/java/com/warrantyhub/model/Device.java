package com.warrantyhub.model;

import com.warrantyhub.model.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
@Entity
@Table(name = "devices",indexes = {
		@Index(name = "idx_device_user_id", columnList = "user_id"),
		@Index(name = "idx_device_warranty_end_date", columnList = "warrantyEndDate"),
		@Index(name = "idx_device_warranty", columnList = "warrantyEndDate"),
		@Index(name = "idx_device_user_status", columnList = "user_id, warrantyStatus")
				})
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String manufacturer;
    private String model;
    private String serialNumber;
    private LocalDate purchaseDate;
    private LocalDate warrantyEndDate;

    @Column(nullable = false)
	@Enumerated
    private Status warrantyStatus;

    private String warrantyProvider;
    private BigDecimal purchasePrice;
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<MaintenanceRecord> maintenanceHistory = new HashSet<>();

    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Document> documents = new ArrayList<>();


	public void updateWarrantyStatus() {
        if (warrantyEndDate == null) {
            this.warrantyStatus = Status.PENDING;
            return;
        }

        LocalDate now = LocalDate.now();
        if (now.isAfter(warrantyEndDate)) {
            this.warrantyStatus = Status.EXPIRED;
        } else if (now.plusDays(7).isAfter(warrantyEndDate)) {
            this.warrantyStatus = Status.EXPIRING_SOON;
        } else {
            this.warrantyStatus = Status.ACTIVE;
        }
    }

    public boolean isWarrantyExpiringSoon() {
        if (warrantyEndDate == null) return false;
        LocalDate now = LocalDate.now();
        return !now.isAfter(warrantyEndDate) && now.plusDays(7).isAfter(warrantyEndDate);
    }
}
