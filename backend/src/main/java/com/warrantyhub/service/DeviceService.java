package com.warrantyhub.service;

import com.warrantyhub.dto.request.DeviceRequest;
import com.warrantyhub.dto.response.ApiResponse;
import com.warrantyhub.dto.response.DeviceDTO;
import com.warrantyhub.dto.response.DeviceListResponse;
import com.warrantyhub.dto.response.DocumentDTO;
import com.warrantyhub.dto.response.MaintenanceRecordDTO;
import com.warrantyhub.model.*;
import com.warrantyhub.exception.ResourceNotFoundException;
import com.warrantyhub.exception.UnauthorizedException;
import com.warrantyhub.model.enums.Status;
import com.warrantyhub.repository.DeviceRepository;
import com.warrantyhub.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;


@Service
public class DeviceService{

    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public DeviceService(
            DeviceRepository deviceRepository,
            UserRepository userRepository,
            ModelMapper modelMapper) {
        this.deviceRepository = deviceRepository;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }


    public DeviceListResponse getAllDevicesByUser(Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        List<Device> devices = deviceRepository.findByUser(user);

        List<DeviceDTO> deviceDTOs = devices.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        DeviceListResponse response = new DeviceListResponse();
        response.setDevices(deviceDTOs);
        return response;
    }


    public DeviceDTO getDeviceById(Long id, Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with id: " + id));
        if (!device.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You don't have permission to access this device");
        }

        return convertToDTO(device);
    }


    @Transactional
    public DeviceDTO createDevice(DeviceRequest deviceRequest, Authentication authentication) {
        User user = getUserFromAuthentication(authentication);

        Device device = new Device();
        device.setName(deviceRequest.getName());
        device.setManufacturer(deviceRequest.getManufacturer());
        device.setModel(deviceRequest.getModel());
        device.setSerialNumber(deviceRequest.getSerialNumber());
        device.setPurchaseDate(deviceRequest.getPurchaseDate());
        device.setWarrantyEndDate(deviceRequest.getWarrantyEndDate());
        device.setWarrantyProvider(deviceRequest.getWarrantyProvider());
        device.setPurchasePrice(deviceRequest.getPurchasePrice());
        device.setNotes(deviceRequest.getNotes());
        device.setUser(user);

        // Set warranty status based on end date and purchase date
        if (device.getWarrantyEndDate() != null && device.getPurchaseDate() != null) {
            LocalDate today = LocalDate.now();
            LocalDate warrantyEnd = device.getWarrantyEndDate();
            LocalDate purchaseDate = device.getPurchaseDate();
            if (warrantyEnd.isAfter(purchaseDate)) {
                if (warrantyEnd.isAfter(today)) {
                    if (warrantyEnd.isBefore(today.plusWeeks(1))) {
                        device.setWarrantyStatus(Status.EXPIRING_SOON);
                    } else {
                        device.setWarrantyStatus(Status.ACTIVE);
                    }
                } else {
                    device.setWarrantyStatus(Status.EXPIRED);
                }
            } else {
                device.setWarrantyStatus(null);
            }
        } else {
            device.setWarrantyStatus(null);
        }

        Device savedDevice = deviceRepository.save(device);
        return convertToDTO(savedDevice);
    }

    @Transactional
    public DeviceDTO updateDevice(Long id, DeviceRequest deviceRequest, Authentication authentication) {
        User user = getUserFromAuthentication(authentication);

        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with id: " + id));

        // Check if device belongs to user
        if (!device.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You don't have permission to update this device");
        }

        // Update device fields
        device.setName(deviceRequest.getName());
        device.setManufacturer(deviceRequest.getManufacturer());
        device.setModel(deviceRequest.getModel());
        device.setSerialNumber(deviceRequest.getSerialNumber());
        device.setPurchaseDate(deviceRequest.getPurchaseDate());
        device.setWarrantyEndDate(deviceRequest.getWarrantyEndDate());
        device.setWarrantyProvider(deviceRequest.getWarrantyProvider());
        device.setPurchasePrice(deviceRequest.getPurchasePrice());
        device.setNotes(deviceRequest.getNotes());

        // Update warranty status based on end date and purchase date
        if (device.getWarrantyEndDate() != null && device.getPurchaseDate() != null) {
            LocalDate today = LocalDate.now();
            LocalDate warrantyEnd = device.getWarrantyEndDate();
            LocalDate purchaseDate = device.getPurchaseDate();
            if (warrantyEnd.isAfter(purchaseDate)) {
                if (warrantyEnd.isAfter(today)) {
                    if (warrantyEnd.isBefore(today.plusWeeks(1))) {
                        device.setWarrantyStatus(Status.EXPIRING_SOON);
                    } else {
                        device.setWarrantyStatus(Status.ACTIVE);
                    }
                } else {
                    device.setWarrantyStatus(Status.EXPIRED);
                }
            } else {
                device.setWarrantyStatus(null);
            }
        } else {
            device.setWarrantyStatus(null);
        }

        Device updatedDevice = deviceRepository.save(device);
        return convertToDTO(updatedDevice);
    }


    @Transactional
    public ApiResponse deleteDevice(Long id, Authentication authentication) {
        User user = getUserFromAuthentication(authentication);

        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with id: " + id));

        // Check if device belongs to user
        if (!device.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You don't have permission to delete this device");
        }

        deviceRepository.delete(device);
        return new ApiResponse(true, "Device deleted successfully");
    }

    private User getUserFromAuthentication(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private DeviceDTO convertToDTO(Device device) {
        DeviceDTO deviceDTO = new DeviceDTO();
        deviceDTO.setId(device.getId().toString());
        deviceDTO.setName(device.getName());
        deviceDTO.setManufacturer(device.getManufacturer());
        deviceDTO.setModel(device.getModel());
        deviceDTO.setSerialNumber(device.getSerialNumber());
        deviceDTO.setPurchaseDate(device.getPurchaseDate());
        deviceDTO.setWarrantyEndDate(device.getWarrantyEndDate());
        deviceDTO.setWarrantyStatus(device.getWarrantyStatus());
        deviceDTO.setWarrantyProvider(device.getWarrantyProvider());
        deviceDTO.setPurchasePrice(device.getPurchasePrice());
        deviceDTO.setNotes(device.getNotes());

        // Convert maintenance records
        List<MaintenanceRecordDTO> maintenanceRecordDTOs = device.getMaintenanceHistory().stream()
                .map(this::convertToMaintenanceDTO)
                .collect(Collectors.toList());
        deviceDTO.setMaintenanceHistory(maintenanceRecordDTOs);

        // Convert documents
        List<DocumentDTO> documentDTOs = device.getDocuments().stream()
                .map(this::convertToDocumentDTO)
                .collect(Collectors.toList());
        deviceDTO.setDocuments(documentDTOs);

        return deviceDTO;
    }

    private MaintenanceRecordDTO convertToMaintenanceDTO(MaintenanceRecord record) {
        MaintenanceRecordDTO dto = new MaintenanceRecordDTO();
        dto.setId(record.getId().toString());
        dto.setDate(record.getDate());
        dto.setType(record.getType());
        dto.setDescription(record.getDescription());
        dto.setCost(record.getCost());
        dto.setServiceProvider(record.getServiceProvider());
        dto.setPartsReplaced(record.getPartsReplaced());
        dto.setNextScheduledDate(record.getNextScheduledDate());
        return dto;
    }

    private DocumentDTO convertToDocumentDTO(Document document) {
        DocumentDTO dto = new DocumentDTO();
        dto.setId(document.getId().toString());
        dto.setName(document.getName());
        
        dto.setFileType(document.getFileType());
        dto.setUploadDate(document.getUploadDate());
        return dto;
    }
}
