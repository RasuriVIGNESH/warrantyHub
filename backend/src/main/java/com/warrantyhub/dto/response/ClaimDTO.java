package com.warrantyhub.dto.response;
import com.warrantyhub.model.ClaimStatus;
import lombok.*;
import java.time.Instant;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ClaimDTO { private Long id; private Long deviceId; private String deviceName; private String issue; private String details; private ClaimStatus status; private Instant openedAt; private Instant updatedAt; }
