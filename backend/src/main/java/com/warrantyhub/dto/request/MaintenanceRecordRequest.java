package com.warrantyhub.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for maintenance record information")
public class MaintenanceRecordRequest {
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Schema(description = "Date when maintenance was performed", example = "2023-06-15")
    private LocalDate date;

    @Schema(description = "Type of maintenance performed", example = "Routine Checkup")
    private String type;

    @Schema(description = "Description of maintenance work", example = "Replaced battery and screen")
    private String description;

    @Schema(description = "Cost of maintenance", example = "150.00")
    private BigDecimal cost;

    @Schema(description = "Service provider who performed maintenance", example = "QuickFix Repairs")
    private String serviceProvider;

    @Schema(description = "List of parts replaced during maintenance", example = "[\"Battery\", \"Screen\"]")
    private List<String> partsReplaced;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Schema(description = "Next scheduled maintenance date", example = "2024-06-15")
    private LocalDate nextScheduledDate;
}