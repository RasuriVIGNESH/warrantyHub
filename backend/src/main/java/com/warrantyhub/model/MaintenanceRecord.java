package com.warrantyhub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "maintenance_records",
		indexes = { @Index(name = "idx_maint_device", columnList = "device_id") })
public class MaintenanceRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    private String type;
    private String description;
    private BigDecimal cost;
    private String serviceProvider;

    @ElementCollection
    @CollectionTable(name = "maintenance_parts_replaced",
            joinColumns = @JoinColumn(name = "maintenance_id"))
    @Column(name = "part_name")
    private List<String> partsReplaced = new ArrayList<>();

    private LocalDate nextScheduledDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;


}
