package com.warrantyhub.service;

import com.warrantyhub.dto.request.ClaimRequest;
import com.warrantyhub.dto.response.ClaimDTO;
import com.warrantyhub.exception.ResourceNotFoundException;
import com.warrantyhub.exception.UnauthorizedException;
import com.warrantyhub.model.*;
import com.warrantyhub.repository.ClaimRepository;
import com.warrantyhub.repository.DeviceRepository;
import com.warrantyhub.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClaimService {
    private final ClaimRepository claims; private final DeviceRepository devices; private final UserRepository users;
    public ClaimService(ClaimRepository claims, DeviceRepository devices, UserRepository users) { this.claims = claims; this.devices = devices; this.users = users; }

    @Transactional(readOnly = true)
    public List<ClaimDTO> list(Authentication auth) { return claims.findByUserIdOrderByUpdatedAtDesc(user(auth).getId()).stream().map(this::dto).toList(); }

    @Transactional
    public ClaimDTO create(ClaimRequest request, Authentication auth) {
        User user = user(auth);
        Device device = devices.findById(request.getDeviceId()).orElseThrow(() -> new ResourceNotFoundException("Device not found"));
        if (!device.getUser().getId().equals(user.getId())) throw new UnauthorizedException("Access denied");
        Claim c = new Claim(); c.setUser(user); c.setDevice(device); c.setIssue(request.getIssue().trim()); c.setDetails(request.getDetails());
        return dto(claims.save(c));
    }

    @Transactional
    public ClaimDTO update(Long id, ClaimStatus status, Authentication auth) {
        Claim c = claims.findByIdAndUserId(id, user(auth).getId()).orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
        if (status == null) throw new IllegalArgumentException("Status is required");
        c.setStatus(status); return dto(claims.save(c));
    }

    private User user(Authentication auth) { return users.findByEmail(auth.getName().toLowerCase()).orElseThrow(() -> new ResourceNotFoundException("User not found")); }
    private ClaimDTO dto(Claim c) { return new ClaimDTO(c.getId(), c.getDevice().getId(), c.getDevice().getName(), c.getIssue(), c.getDetails(), c.getStatus(), c.getOpenedAt(), c.getUpdatedAt()); }
}
