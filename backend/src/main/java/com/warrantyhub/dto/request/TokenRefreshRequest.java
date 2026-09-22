package com.warrantyhub.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for refreshing authentication token")
public class TokenRefreshRequest {
    @NotBlank(message = "Refresh token is required")
    @Schema(description = "Refresh token for obtaining new access token", example = "abc123-xyz456")
    private String refreshToken;
}