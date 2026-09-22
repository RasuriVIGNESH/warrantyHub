package com.warrantyhub.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Authentication response containing user data and token")
public class AuthResponse {
    @Schema(description = "Indicates if authentication was successful", example = "true")
    private boolean success;

    @Schema(description = "Authenticated user information")
    private UserDTO user;

    @Schema(description = "JWT access token for authenticated requests", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;

    @Schema(description = "Refresh token for obtaining new access tokens", example = "550e8400-e29b-41d4-a716-446655440000")
    private String refreshToken;

}