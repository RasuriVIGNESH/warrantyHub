package com.warrantyhub.controller;
import com.warrantyhub.dto.request.ClaimRequest;
import com.warrantyhub.dto.response.ClaimDTO;
import com.warrantyhub.model.ClaimStatus;
import com.warrantyhub.service.ClaimService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/claims")
public class ClaimController {
    private final ClaimService service;
    public ClaimController(ClaimService service) { this.service = service; }
    @GetMapping public ResponseEntity<List<ClaimDTO>> list(Authentication auth) { return ResponseEntity.ok(service.list(auth)); }
    @PostMapping public ResponseEntity<ClaimDTO> create(@Valid @RequestBody ClaimRequest request, Authentication auth) { return ResponseEntity.status(201).body(service.create(request, auth)); }
    @PatchMapping("/{id}") public ResponseEntity<ClaimDTO> update(@PathVariable Long id, @RequestParam ClaimStatus status, Authentication auth) { return ResponseEntity.ok(service.update(id, status, auth)); }
}
