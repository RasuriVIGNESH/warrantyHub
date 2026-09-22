package com.warrantyhub.controller;

import com.warrantyhub.dto.request.DeviceRequest;
import com.warrantyhub.dto.response.ApiResponse;
import com.warrantyhub.dto.response.DeviceDTO;
import com.warrantyhub.dto.response.DeviceListResponse;
import com.warrantyhub.service.DeviceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
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
@RequestMapping("/api/devices" )
@Tag(name = "Device Management", description = "CRUD operations for user devices")
@SecurityRequirements({
        @SecurityRequirement(name = "Bearer Authentication"),
        @SecurityRequirement(name = "Google OAuth2")
})
public class DeviceController {

    private final DeviceService deviceService;

    @Autowired
    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping
    @Operation(
            summary = "Get all user devices",
            description = "Retrieves a list of all devices belonging to the authenticated user"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Devices retrieved successfully",
            content = @Content(schema = @Schema(implementation = DeviceListResponse.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Invalid or missing authentication token",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    public ResponseEntity<DeviceListResponse> getAllDevices(@Parameter(hidden = true) Authentication authentication) {
        return ResponseEntity.ok(deviceService.getAllDevicesByUser(authentication));
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Get device by ID",
            description = "Retrieves a specific device by its ID if it belongs to the authenticated user"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Device retrieved successfully",
            content = @Content(schema = @Schema(implementation = DeviceDTO.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Device not found or doesn\"t belong to the user",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Invalid or missing authentication token",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    public ResponseEntity<DeviceDTO> getDeviceById(
            @PathVariable Long id,
            @Parameter(hidden = true) Authentication authentication) {
        return ResponseEntity.ok(deviceService.getDeviceById(id, authentication));
    }

    @PostMapping("/new")
    @Operation(
            summary = "Create a new device",
            description = "Creates a new device for the authenticated user",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Device creation data",
                    required = true,
                    content = @Content(schema = @Schema(implementation = DeviceRequest.class))
            )
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Device created successfully",
            content = @Content(schema = @Schema(implementation = DeviceDTO.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "400",
            description = "Invalid device data",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Invalid or missing authentication token",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    public ResponseEntity<DeviceDTO> createDevice(
            @Valid @RequestBody DeviceRequest deviceRequest,
            @Parameter(hidden = true) Authentication authentication) {
        return ResponseEntity.ok(deviceService.createDevice(deviceRequest, authentication));
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Update a device",
            description = "Updates an existing device if it belongs to the authenticated user",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Device update data",
                    required = true,
                    content = @Content(schema = @Schema(implementation = DeviceRequest.class))
            )
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Device updated successfully",
            content = @Content(schema = @Schema(implementation = DeviceDTO.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Device not found or doesn\"t belong to the user",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "400",
            description = "Invalid device data",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Invalid or missing authentication token",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    public ResponseEntity<DeviceDTO> updateDevice(
            @PathVariable Long id,
            @Valid @RequestBody DeviceRequest deviceRequest,
            @Parameter(hidden = true) @AuthenticationPrincipal Authentication authentication) {
        return ResponseEntity.ok(deviceService.updateDevice(id, deviceRequest, authentication));
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete a device",
            description = "Deletes a device if it belongs to the authenticated user"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Device deleted successfully",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Device not found or doesn\"t belong to the user",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Invalid or missing authentication token",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))
    )
    public ResponseEntity<ApiResponse> deleteDevice(
            @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal Authentication authentication) {
        deviceService.deleteDevice(id, authentication);
        return ResponseEntity.noContent().build();
    }
}
