package com.warrantyhub.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Token refresh response containing new access and refresh tokens")
public class TokenRefreshResponse {
    @Schema(description = "Indicates if token refresh was successful", example = "true")
    private boolean success;

    @Schema(description = "New JWT access token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;

    @Schema(description = "New refresh token", example = "abc123-xyz456")
    private String refreshToken;

}