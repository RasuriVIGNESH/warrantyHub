package com.warrantyhub.service;

import com.warrantyhub.dto.request.MaintenanceRecordRequest;
import com.warrantyhub.dto.response.ApiResponse;
import com.warrantyhub.dto.response.DeviceDTO;
import com.warrantyhub.model.Device;
import com.warrantyhub.model.MaintenanceRecord;
import com.warrantyhub.model.User;
import com.warrantyhub.exception.ResourceNotFoundException;
import com.warrantyhub.exception.UnauthorizedException;
import com.warrantyhub.repository.DeviceRepository;
import com.warrantyhub.repository.MaintenanceRecordRepository;
import com.warrantyhub.repository.UserRepository;
import com.warrantyhub.service.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MaintenanceService {

    private final DeviceRepository deviceRepository;
    private final MaintenanceRecordRepository maintenanceRecordRepository;
    private final UserRepository userRepository;
    private final DeviceService deviceService;

    @Autowired
    public MaintenanceService(
            DeviceRepository deviceRepository,
            MaintenanceRecordRepository maintenanceRecordRepository,
            UserRepository userRepository,
            DeviceService deviceService) {
        this.deviceRepository = deviceRepository;
        this.maintenanceRecordRepository = maintenanceRecordRepository;
        this.userRepository = userRepository;
        this.deviceService = deviceService;
    }


    @Transactional
    public DeviceDTO addMaintenanceRecord(Long deviceId, MaintenanceRecordRequest request, Authentication authentication) {
        User user = getUserFromAuthentication(authentication);

        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with id: " + deviceId));

        // Check if device belongs to user
        if (!device.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You don't have permission to add maintenance records to this device");
        }

        // Create new maintenance record
        MaintenanceRecord record = new MaintenanceRecord();
        record.setDate(request.getDate());
        record.setType(request.getType());
        record.setDescription(request.getDescription());
        record.setCost(request.getCost());
        record.setServiceProvider(request.getServiceProvider());
        record.setPartsReplaced(request.getPartsReplaced());
        record.setNextScheduledDate(request.getNextScheduledDate());
        record.setDevice(device);

        // Save record
        maintenanceRecordRepository.save(record);

        // Return updated device
        return deviceService.getDeviceById(deviceId, authentication);
    }


    @Transactional
    public DeviceDTO updateMaintenanceRecord(Long deviceId, Long recordId, MaintenanceRecordRequest request, Authentication authentication) {
        User user = getUserFromAuthentication(authentication);

        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with id: " + deviceId));

        // Check if device belongs to user
        if (!device.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You don't have permission to update maintenance records for this device");
        }

        // Find maintenance record
        MaintenanceRecord record = maintenanceRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance record not found with id: " + recordId));

        // Check if record belongs to device
        if (!record.getDevice().getId().equals(deviceId)) {
            throw new UnauthorizedException("Maintenance record does not belong to the specified device");
        }

        // Update record
        record.setDate(request.getDate());
        record.setType(request.getType());
        record.setDescription(request.getDescription());
        record.setCost(request.getCost());
        record.setServiceProvider(request.getServiceProvider());
        record.setPartsReplaced(request.getPartsReplaced());
        record.setNextScheduledDate(request.getNextScheduledDate());

        // Save record
        maintenanceRecordRepository.save(record);

        // Return updated device
        return deviceService.getDeviceById(deviceId, authentication);
    }


    public ApiResponse deleteMaintenanceRecord(Long deviceId, Long recordId, Authentication authentication) {
        User user = getUserFromAuthentication(authentication);

        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with id: " + deviceId));

        // Check if device belongs to user
        if (!device.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You don't have permission to delete maintenance records for this device");
        }

        // Find maintenance record
        MaintenanceRecord record = maintenanceRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance record not found with id: " + recordId));

        // Check if record belongs to device
        if (!record.getDevice().getId().equals(deviceId)) {
            throw new UnauthorizedException("Maintenance record does not belong to the specified device");
        }

        // Delete record
        maintenanceRecordRepository.delete(record);

        return new ApiResponse(true, "Maintenance record deleted successfully");
    }

    private User getUserFromAuthentication(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
