package com.warrantyhub.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.warrantyhub.model.enums.Status;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeviceDTO {
    private String id;
    private String name;
    private String type;
    private String category;
    private String manufacturer;
    private String model;
    private String serialNumber;
    @JsonFormat(pattern = "yyyy-MM-dd") private LocalDate purchaseDate;
    @JsonFormat(pattern = "yyyy-MM-dd") private LocalDate warrantyEndDate;
    private Integer warrantyDuration;
    private String warrantyUnit;
    private Status warrantyStatus;
    private Long daysRemaining;
    private Integer healthScore;
    private Integer recordCompleteness;
    private String warrantyProvider;
    private BigDecimal purchasePrice;
    private String notes;
    private List<MaintenanceRecordDTO> maintenanceHistory;
    private List<DocumentDTO> documents;
}
