package com.warrantyhub.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "claims", indexes = @Index(name = "idx_claim_user", columnList = "user_id"))
@Getter @Setter @NoArgsConstructor
public class Claim {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "device_id")
    private Device device;

    @Column(nullable = false)
    private String issue;

    @Column(length = 4000)
    private String details;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private ClaimStatus status = ClaimStatus.DRAFT;

    @Column(nullable = false, updatable = false)
    private Instant openedAt;

    private Instant updatedAt;
    @PrePersist void created() { openedAt = Instant.now(); updatedAt = openedAt; }
    @PreUpdate void changed() { updatedAt = Instant.now(); }
}
