package com.warrantyhub.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;


@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for device information")
public class DeviceRequest {
    @NotBlank(message = "Device name is required")
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

    @Schema(description = "Provider of the warranty", example = "Best Warranty Inc")
    private String warrantyProvider;

    @Schema(description = "Purchase price of the device", example = "999.99")
    private BigDecimal purchasePrice;

    @Schema(description = "Additional notes about the device", example = "Purchased from Amazon")
    private String notes;

}