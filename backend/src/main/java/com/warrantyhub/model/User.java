package com.warrantyhub.model;

import com.warrantyhub.model.enums.Provider;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter  @Setter
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true)
    private String password;

    private String resetPasswordToken;

    private Instant resetPasswordTokenExpiry;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Device> devices = new ArrayList<>();

    @Embedded
    private UserPreferences preferences = new UserPreferences();

    @Column(name = "enabled", nullable = false)
    private boolean enabled = true;

    @Column(name = "provider")
    private Provider provider;

    @Column(name = "provider_id")
    private String providerId;


}