package com.warrantyhub.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "List of devices response")
public class DeviceListResponse {
    @Schema(description = "Collection of devices")
    private List<DeviceDTO> devices;
}