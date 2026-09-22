package com.warrantyhub.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for updating user profile")
public class UserProfileUpdateRequest {
    @Schema(description = "User's full name", example = "John Smith")
    private String name;

    @Schema(description = "Enable/disable email notifications", example = "true")
    private boolean emailNotifications;

    @Schema(description = "Days before warranty expiration to send reminders", example = "7")
    private int warrantyExpirationReminders;
}