package com.warrantyhub.controller;

import com.warrantyhub.dto.request.MaintenanceRecordRequest;
import com.warrantyhub.dto.response.ApiResponse;
import com.warrantyhub.dto.response.DeviceDTO;
import com.warrantyhub.service.MaintenanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;

@RestController
@RequestMapping("/api/devices/{deviceId}/maintenance" )
@Tag(name = "Maintenance Management", description = "Operations for managing device maintenance records")
@SecurityRequirements({
        @SecurityRequirement(name = "Bearer Authentication"),
        @SecurityRequirement(name = "Google OAuth2")
})
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @Autowired
    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @PostMapping
    @Operation(
            summary = "Add a maintenance record",
            description = "Adds a new maintenance record for a specific device"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Maintenance record added successfully",
            content = @Content(schema = @Schema(implementation = DeviceDTO.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "400",
            description = "Invalid maintenance record data",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Invalid or missing authentication token",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Device not found or doesn\"t belong to the user",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    public ResponseEntity<DeviceDTO> addMaintenanceRecord(
            @Parameter(description = "ID of the device to add maintenance record to", required = true)
            @PathVariable Long deviceId,
            @Valid @RequestBody MaintenanceRecordRequest request,
            @Parameter(hidden = true) Authentication authentication) {
        return ResponseEntity.ok(maintenanceService.addMaintenanceRecord(deviceId, request, authentication));
    }

    @PutMapping("/{recordId}")
    @Operation(
            summary = "Update a maintenance record",
            description = "Updates an existing maintenance record for a specific device"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Maintenance record updated successfully",
            content = @Content(schema = @Schema(implementation = DeviceDTO.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "400",
            description = "Invalid maintenance record data",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Invalid or missing authentication token",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Device or maintenance record not found or doesn\"t belong to the user",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    public ResponseEntity<DeviceDTO> updateMaintenanceRecord(
            @Parameter(description = "ID of the device that owns the maintenance record", required = true)
            @PathVariable Long deviceId,
            @Parameter(description = "ID of the maintenance record to update", required = true)
            @PathVariable Long recordId,
            @Valid @RequestBody MaintenanceRecordRequest request,
            @Parameter(hidden = true) Authentication authentication) {
        return ResponseEntity.ok(maintenanceService.updateMaintenanceRecord(deviceId, recordId, request, authentication));
    }

    @DeleteMapping("/{recordId}")
    @Operation(
            summary = "Delete a maintenance record",
            description = "Deletes an existing maintenance record for a specific device"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Maintenance record deleted successfully",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Invalid or missing authentication token",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Device or maintenance record not found or doesn\"t belong to the user",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    public ResponseEntity<ApiResponse> deleteMaintenanceRecord(
            @Parameter(description = "ID of the device that owns the maintenance record", required = true)
            @PathVariable Long deviceId,
            @Parameter(description = "ID of the maintenance record to delete", required = true)
            @PathVariable Long recordId,
            @Parameter(hidden = true) Authentication authentication) {
        return ResponseEntity.ok(maintenanceService.deleteMaintenanceRecord(deviceId, recordId, authentication));
    }
}
