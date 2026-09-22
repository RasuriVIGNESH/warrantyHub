package com.warrantyhub.controller;

import com.warrantyhub.dto.request.LoginRequest;
import com.warrantyhub.dto.request.PasswordResetConfirmRequest;
import com.warrantyhub.dto.request.PasswordResetRequest;
import com.warrantyhub.dto.request.RegisterRequest;
import com.warrantyhub.dto.request.TokenRefreshRequest;
import com.warrantyhub.dto.response.ApiResponse;
import com.warrantyhub.dto.response.AuthResponse;
import com.warrantyhub.dto.response.TokenRefreshResponse;
import com.warrantyhub.dto.response.UserProfileDTO;
import com.warrantyhub.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication and user management endpoints supporting both email/password and OAuth2 login")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(
            summary = "User registration",
            description = "Registers a new user with email and password",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "User registration data",
                    required = true,
                    content = @Content(schema = @Schema(implementation = RegisterRequest.class))
            )
    )
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(201).body(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(
            summary = "User login",
            description = "Authenticates user with email/password and returns JWT tokens. For OAuth2 login, use the 'Google OAuth2' authorization button above.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Login credentials (email and password)",
                    required = true,
                    content = @Content(schema = @Schema(implementation = LoginRequest.class))
            )
    )
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh-token")
    @Operation(
            summary = "Refresh token",
            description = "Refreshes the access token using a valid refresh token",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Refresh token data",
                    required = true,
                    content = @Content(schema = @Schema(implementation = TokenRefreshRequest.class))
            )
    )
    public ResponseEntity<TokenRefreshResponse> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request.getRefreshToken()));
    }

    @PostMapping("/forgot-password")
    @Operation(
            summary = "Request password reset",
            description = "Sends a password reset link to the user's email address",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Email for password reset",
                    required = true,
                    content = @Content(schema = @Schema(implementation = PasswordResetRequest.class))
            )
    )
    public ResponseEntity<ApiResponse> requestPasswordReset(
            @Parameter(hidden = true)
            @Valid @RequestBody PasswordResetRequest request) {
        return ResponseEntity.ok(authService.requestPasswordReset(request.getEmail()));
    }

    @PostMapping("/reset-password")
    @Operation(
            summary = "Reset password",
            description = "Resets user password using a reset token",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Password reset data",
                    required = true,
                    content = @Content(schema = @Schema(implementation = PasswordResetConfirmRequest.class))
            )
    )
    public ResponseEntity<ApiResponse> resetPassword(
            @Parameter(hidden = true)
            @Valid @RequestBody PasswordResetConfirmRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request.getToken(), request.getPassword()));
    }

    @PostMapping("/logout")
    @Operation(
            summary = "Logout user",
            description = "Logs out the current user and invalidates tokens (works for both JWT and OAuth2 sessions)",
            security = {
                    @SecurityRequirement(name = "Bearer Authentication"),
                    @SecurityRequirement(name = "Google OAuth2")
            }
    )
    public ResponseEntity<ApiResponse> logout() {
        return ResponseEntity.ok(authService.logout());
    }

    @GetMapping("/profile")
    @Operation(
            summary = "Get user profile",
            description = "Returns the profile of the currently authenticated user (supports both JWT and OAuth2 authentication)",
            security = {
                    @SecurityRequirement(name = "Bearer Authentication"),
                    @SecurityRequirement(name = "Google OAuth2")
            }
    )
    public ResponseEntity<UserProfileDTO> getProfile(Authentication authentication) {
        return ResponseEntity.ok(authService.getProfile(authentication));
    }
}