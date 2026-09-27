package com.warrantyhub.service;

import com.warrantyhub.dto.response.DashboardDTO;
import com.warrantyhub.exception.ResourceNotFoundException;
import com.warrantyhub.model.enums.Status;
import com.warrantyhub.repository.DeviceRepository;
import com.warrantyhub.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class DashboardService {
    private final DeviceRepository devices; private final UserRepository users;
    public DashboardService(DeviceRepository devices, UserRepository users) { this.devices = devices; this.users = users; }
    @Transactional(readOnly = true)
    public DashboardDTO get(Authentication auth) {
        var user = users.findByEmail(auth.getName().toLowerCase()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        var list = devices.findByUserWithDetails(user);
        long active = list.stream().filter(d -> d.getWarrantyStatus() == Status.ACTIVE).count();
        long soon = list.stream().filter(d -> d.getWarrantyStatus() == Status.EXPIRING_SOON).count();
        long expired = list.stream().filter(d -> d.getWarrantyStatus() == Status.EXPIRED).count();
        long missing = list.stream().filter(d -> d.getDocuments() == null || d.getDocuments().isEmpty()).count();
        int completeness = list.isEmpty() ? 0 : (int) list.stream().mapToInt(d -> {
            int score = d.getName() != null ? 20 : 0; score += d.getSerialNumber() != null ? 20 : 0; score += d.getPurchaseDate() != null ? 20 : 0;
            score += d.getWarrantyEndDate() != null ? 20 : 0; score += d.getDocuments() != null && !d.getDocuments().isEmpty() ? 20 : 0; return score;
        }).average().orElse(0);
        BigDecimal value = list.stream().map(d -> d.getPurchasePrice() == null ? BigDecimal.ZERO : d.getPurchasePrice()).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new DashboardDTO(new DashboardDTO.Stats(list.size(), active, soon, expired, value, missing, completeness));
    }
}
