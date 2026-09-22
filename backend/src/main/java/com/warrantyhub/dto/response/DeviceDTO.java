package com.warrantyhub.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.warrantyhub.model.enums.Status;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Device information with warranty and maintenance details")
public class DeviceDTO {
    @Schema(description = "Unique identifier of the device", example = "65a8f4e3b8d1c12e3f4a5b6c")
    private String id;

    @Schema(description = "Name of the device", example = "Smartphone X")
    private String name;

    @Schema(description = "Manufacturer of the device", example = "TechCorp")
    private String manufacturer;

    @Schema(description = "Model of the device", example = "X-2000")
    private String model;

    @Schema(description = "Serial number of the device", example = "SN123456789")
    private String serialNumber;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Schema(description = "Date when the device was purchased", example = "2023-01-15")
    private LocalDate purchaseDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Schema(description = "Date when the warranty expires", example = "2025-01-15")
    private LocalDate warrantyEndDate;

    @Schema(description = "Current warranty status", example = "ACTIVE")
    private Status warrantyStatus;

    @Schema(description = "Provider of the warranty", example = "Best Warranty Inc")
    private String warrantyProvider;

    @Schema(description = "Purchase price of the device", example = "999.99")
    private BigDecimal purchasePrice;

    @Schema(description = "Additional notes about the device", example = "Purchased from Amazon")
    private String notes;

    @Schema(description = "List of maintenance records for the device")
    private List<MaintenanceRecordDTO> maintenanceHistory;

    @Schema(description = "List of documents associated with the device")
    private List<DocumentDTO> documents;
}