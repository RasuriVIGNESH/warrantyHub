package com.warrantyhub.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Generic API response structure")
public class ApiResponse {
    @Schema(description = "Indicates if the operation was successful", example = "true")
    private boolean success;

    @Schema(description = "Message describing the operation result", example = "Operation completed successfully")
    private String message;
}