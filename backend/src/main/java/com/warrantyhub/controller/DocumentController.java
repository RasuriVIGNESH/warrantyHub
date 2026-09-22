package com.warrantyhub.controller;

import com.warrantyhub.dto.response.ApiResponse;
import com.warrantyhub.dto.response.DocumentDTO;
import com.warrantyhub.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;

import java.util.List;

@RestController
@RequestMapping("/api/devices/{deviceId}/documents")
@Tag(name = "Document Management", description = "Operations for managing device documents")
@SecurityRequirements({
        @SecurityRequirement(name = "Bearer Authentication"),
        @SecurityRequirement(name = "Google OAuth2")
})
public class DocumentController {

    private final DocumentService documentService;
    private final DocumentService documentServiceImpl;

    @Autowired
    public DocumentController(DocumentService documentService, DocumentService documentServiceImpl) {
        this.documentService = documentService;
        this.documentServiceImpl = documentServiceImpl;
    }

    @PostMapping
    @Operation(
            summary = "Upload a document",
            description = "Uploads a document for a specific device. Maximum 3 documents per device. Maximum file size: 10MB."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Document uploaded successfully",
            content = @Content(schema = @Schema(implementation = DocumentDTO.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "400",
            description = "Invalid file or request",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Invalid or missing authentication token",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Device not found or doesn't belong to the user",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    public ResponseEntity<DocumentDTO> uploadDocument(
            @Parameter(description = "ID of the device to attach the document to", required = true)
            @PathVariable Long deviceId,
            @Parameter(description = "Document file to upload", required = true)
            @RequestParam("file") MultipartFile file,
            @Parameter(hidden = true) Authentication authentication) {
        return ResponseEntity.ok(documentService.uploadDocument(deviceId, file, authentication));
    }

    @GetMapping
    @Operation(
            summary = "Get all documents for a device",
            description = "Retrieves all documents associated with a specific device"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Documents retrieved successfully",
            content = @Content(schema = @Schema(implementation = DocumentDTO.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Invalid or missing authentication token",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Device not found or doesn't belong to the user",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    public ResponseEntity<List<DocumentDTO>> getDocuments(
            @Parameter(description = "ID of the device to get documents for", required = true)
            @PathVariable Long deviceId,
            @Parameter(hidden = true) Authentication authentication) {
        return ResponseEntity.ok(documentServiceImpl.getDocumentsByDevice(deviceId, authentication));
    }

//    @GetMapping("/{documentId}")
//    @Operation(
//            summary = "Download a document",
//            description = "Downloads a specific document by its ID"
//    )
//    @io.swagger.v3.oas.annotations.responses.ApiResponse(
//            responseCode = "200",
//            description = "Document downloaded successfully",
//            content = @Content(schema = @Schema(implementation = Resource.class))
//    )
//    @io.swagger.v3.oas.annotations.responses.ApiResponse(
//            responseCode = "401",
//            description = "Unauthorized - Invalid or missing authentication token",
//            content = @Content(schema = @Schema(implementation = ApiResponse.class))
//    )
//    @io.swagger.v3.oas.annotations.responses.ApiResponse(
//            responseCode = "404",
//            description = "Document not found or doesn't belong to the user",
//            content = @Content(schema = @Schema(implementation = ApiResponse.class))
//    )
//    public ResponseEntity<Resource> downloadDocument(
//            @Parameter(description = "ID of the device that owns the document", required = true)
//            @PathVariable Long deviceId,
//            @Parameter(description = "ID of the document to download", required = true)
//            @PathVariable Long documentId,
//             @Parameter(hidden = true) @AuthenticationPrincipal Authentication authentication) {
//        Resource resource = documentService.downloadDocument(documentId, authentication);
//
//        // Determine content type from the resource filename
//        String contentType = "application/octet-stream";
//        String filename = resource.getFilename();
//        if (filename != null) {
//            if (filename.toLowerCase().endsWith(".pdf")) {
//                contentType = "application/pdf";
//            } else if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
//                contentType = "image/jpeg";
//            } else if (filename.toLowerCase().endsWith(".png")) {
//                contentType = "image/png";
//            } else if (filename.toLowerCase().endsWith(".txt")) {
//                contentType = "text/plain";
//            } else if (filename.toLowerCase().endsWith(".doc")) {
//                contentType = "application/msword";
//            } else if (filename.toLowerCase().endsWith(".docx")) {
//                contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
//            }
//        }
//
//        return ResponseEntity.ok()
//                .contentType(MediaType.parseMediaType(contentType))
//                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
//                .body(resource);
//    }

    @DeleteMapping("/{documentId}")
    @Operation(
            summary = "Delete a document",
            description = "Deletes a specific document by its ID"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Document deleted successfully",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Invalid or missing authentication token",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Document not found or doesn't belong to the user",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    public ResponseEntity<ApiResponse> deleteDocument(
            @Parameter(description = "ID of the device that owns the document", required = true)
            @PathVariable Long deviceId,
            @Parameter(description = "ID of the document to delete", required = true)
            @PathVariable Long documentId,
            @Parameter(hidden = true) Authentication authentication) {
        return ResponseEntity.ok(documentService.deleteDocument(deviceId, documentId, authentication));
    }
}

