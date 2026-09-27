package com.warrantyhub.controller;
import com.warrantyhub.dto.response.DashboardDTO;
import com.warrantyhub.service.DashboardService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService service;
    public DashboardController(DashboardService service) { this.service = service; }
    @GetMapping public DashboardDTO get(Authentication auth) { return service.get(auth); }
}
