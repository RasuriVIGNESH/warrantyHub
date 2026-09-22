package com.warrantyhub.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Basic user information")
public class UserDTO {
    @Schema(description = "Unique identifier of the user", example = "65a8f4e3b8d1c12e3f4a5b6f")
    private String id;

    @Schema(description = "Full name of the user", example = "John Doe")
    private String name;

    @Schema(description = "Email address of the user", example = "john.doe@example.com")
    private String email;
}