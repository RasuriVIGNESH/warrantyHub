package com.warrantyhub.dto.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ClaimRequest {
    @NotNull private Long deviceId;
    @NotBlank private String issue;
    private String details;
}
