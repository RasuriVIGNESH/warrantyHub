package com.warrantyhub.controller;

import com.warrantyhub.dto.request.DeviceRequest;
import com.warrantyhub.dto.response.DeviceDTO;
import com.warrantyhub.dto.response.DeviceListResponse;
import com.warrantyhub.model.enums.Status;
import com.warrantyhub.service.DeviceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {
    private final DeviceService service;
    public DeviceController(DeviceService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<DeviceListResponse> list(Authentication auth,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(service.getAllDevicesByUser(auth, q, status, category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeviceDTO> get(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(service.getDeviceById(id, auth));
    }

    @PostMapping
    public ResponseEntity<DeviceDTO> create(@Valid @RequestBody DeviceRequest request, Authentication auth) {
        return ResponseEntity.status(201).body(service.createDevice(request, auth));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeviceDTO> update(@PathVariable Long id, @Valid @RequestBody DeviceRequest request, Authentication auth) {
        return ResponseEntity.ok(service.updateDevice(id, request, auth));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        service.deleteDevice(id, auth);
        return ResponseEntity.noContent().build();
    }
}
