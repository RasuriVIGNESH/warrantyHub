package com.warrantyhub.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Device create/update request")
public class DeviceRequest {
    @NotBlank(message = "Device name is required")
    private String name;
    private String type;
    private String category;
    private String manufacturer;
    private String model;
    private String serialNumber;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate purchaseDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate warrantyEndDate;

    @Positive(message = "Warranty duration must be positive")
    private Integer warrantyDuration;
    private String warrantyUnit;
    private String warrantyProvider;

    @PositiveOrZero(message = "Purchase price cannot be negative")
    private BigDecimal purchasePrice;
    private String notes;
}
