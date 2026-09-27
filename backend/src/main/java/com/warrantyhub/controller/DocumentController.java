package com.warrantyhub.controller;

import com.warrantyhub.dto.response.ApiResponse;
import com.warrantyhub.dto.response.DocumentDTO;
import com.warrantyhub.service.DocumentService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/devices/{deviceId}/documents")
public class DocumentController {
    private final DocumentService service;
    public DocumentController(DocumentService service) { this.service = service; }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentDTO> upload(@PathVariable Long deviceId, @RequestPart MultipartFile file, Authentication auth) {
        return ResponseEntity.status(201).body(service.upload(deviceId, file, auth));
    }

    @GetMapping
    public ResponseEntity<List<DocumentDTO>> list(@PathVariable Long deviceId, Authentication auth) {
        return ResponseEntity.ok(service.list(deviceId, auth));
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long deviceId, @PathVariable Long documentId, Authentication auth) {
        return ResponseEntity.ok(service.delete(deviceId, documentId, auth));
    }
}
