package com.warrantyhub.service;

import com.warrantyhub.dto.request.DeviceRequest;
import com.warrantyhub.dto.response.*;
import com.warrantyhub.exception.ResourceNotFoundException;
import com.warrantyhub.exception.UnauthorizedException;
import com.warrantyhub.model.*;
import com.warrantyhub.model.enums.Status;
import com.warrantyhub.repository.DeviceRepository;
import com.warrantyhub.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;

@Service
public class DeviceService {
    private final DeviceRepository devices;
    private final UserRepository users;

    public DeviceService(DeviceRepository devices, UserRepository users) {
        this.devices = devices;
        this.users = users;
    }

    @Transactional(readOnly = true)
    public DeviceListResponse getAllDevicesByUser(Authentication auth, String query, Status status, String category) {
        User user = currentUser(auth);
        var result = devices.findByUserWithDetails(user).stream()
                .filter(d -> status == null || d.getWarrantyStatus() == status)
                .filter(d -> category == null || category.isBlank() || category.equalsIgnoreCase(d.getCategory()))
                .filter(d -> query == null || query.isBlank() || searchable(d).contains(query.toLowerCase()))
                .sorted(Comparator.comparing(Device::getWarrantyEndDate, Comparator.nullsLast(Comparator.naturalOrder())))
                .map(this::toDto).toList();
        return new DeviceListResponse(result);
    }

    @Transactional(readOnly = true)
    public DeviceDTO getDeviceById(Long id, Authentication auth) {
        Device device = devices.findByIdWithDetails(id).orElseThrow(() -> new ResourceNotFoundException("Device not found"));
        requireOwner(device, currentUser(auth));
        return toDto(device);
    }

    @Transactional
    public DeviceDTO createDevice(DeviceRequest request, Authentication auth) {
        Device device = new Device();
        device.setUser(currentUser(auth));
        apply(device, request);
        return toDto(devices.save(device));
    }

    @Transactional
    public DeviceDTO updateDevice(Long id, DeviceRequest request, Authentication auth) {
        Device device = ownedDevice(id, auth);
        apply(device, request);
        return toDto(devices.save(device));
    }

    @Transactional
    public void deleteDevice(Long id, Authentication auth) {
        devices.delete(ownedDevice(id, auth));
    }

    private void apply(Device d, DeviceRequest r) {
        if (r.getPurchaseDate() != null && r.getWarrantyEndDate() != null && r.getWarrantyEndDate().isBefore(r.getPurchaseDate())) {
            throw new IllegalArgumentException("Warranty end date cannot be before purchase date");
        }
        d.setName(r.getName().trim()); d.setType(r.getType()); d.setCategory(r.getCategory()); d.setManufacturer(r.getManufacturer());
        d.setModel(r.getModel()); d.setSerialNumber(r.getSerialNumber()); d.setPurchaseDate(r.getPurchaseDate());
        d.setWarrantyEndDate(r.getWarrantyEndDate()); d.setWarrantyDuration(r.getWarrantyDuration()); d.setWarrantyUnit(r.getWarrantyUnit());
        d.setWarrantyProvider(r.getWarrantyProvider()); d.setPurchasePrice(r.getPurchasePrice()); d.setNotes(r.getNotes());
        d.updateWarrantyStatus();
    }

    private Device ownedDevice(Long id, Authentication auth) {
        Device device = devices.findByIdWithDetails(id).orElseThrow(() -> new ResourceNotFoundException("Device not found"));
        requireOwner(device, currentUser(auth));
        return device;
    }

    private void requireOwner(Device device, User user) {
        if (!device.getUser().getId().equals(user.getId())) throw new UnauthorizedException("Access denied");
    }

    private User currentUser(Authentication auth) {
        if (auth == null || auth.getName() == null) throw new UnauthorizedException("Authentication required");
        return users.findByEmail(auth.getName().trim().toLowerCase()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private String searchable(Device d) {
        return String.join(" ", String.valueOf(d.getName()), String.valueOf(d.getManufacturer()), String.valueOf(d.getModel()), String.valueOf(d.getSerialNumber())).toLowerCase();
    }

    private DeviceDTO toDto(Device d) {
        long days = d.getWarrantyEndDate() == null ? 0 : ChronoUnit.DAYS.between(LocalDate.now(), d.getWarrantyEndDate());
        int completeness = 0;
        if (d.getName() != null && !d.getName().isBlank()) completeness += 20;
        if (d.getSerialNumber() != null && !d.getSerialNumber().isBlank()) completeness += 20;
        if (d.getPurchaseDate() != null) completeness += 20;
        if (d.getWarrantyEndDate() != null) completeness += 20;
        if (d.getDocuments() != null && !d.getDocuments().isEmpty()) completeness += 20;
        int health = Math.max(0, completeness - (d.getWarrantyStatus() == Status.EXPIRED ? 30 : 0));
        DeviceDTO dto = new DeviceDTO();
        dto.setId(String.valueOf(d.getId())); dto.setName(d.getName()); dto.setType(d.getType()); dto.setCategory(d.getCategory());
        dto.setManufacturer(d.getManufacturer()); dto.setModel(d.getModel()); dto.setSerialNumber(d.getSerialNumber()); dto.setPurchaseDate(d.getPurchaseDate());
        dto.setWarrantyEndDate(d.getWarrantyEndDate()); dto.setWarrantyDuration(d.getWarrantyDuration()); dto.setWarrantyUnit(d.getWarrantyUnit());
        dto.setWarrantyStatus(d.getWarrantyStatus()); dto.setDaysRemaining(days); dto.setHealthScore(health); dto.setRecordCompleteness(completeness);
        dto.setWarrantyProvider(d.getWarrantyProvider()); dto.setPurchasePrice(d.getPurchasePrice()); dto.setNotes(d.getNotes());
        dto.setMaintenanceHistory(d.getMaintenanceHistory().stream().map(this::toMaintenance).toList());
        dto.setDocuments(d.getDocuments().stream().map(this::toDocument).toList());
        return dto;
    }

    private MaintenanceRecordDTO toMaintenance(MaintenanceRecord r) {
        MaintenanceRecordDTO dto = new MaintenanceRecordDTO(); dto.setId(String.valueOf(r.getId())); dto.setDate(r.getDate()); dto.setType(r.getType());
        dto.setDescription(r.getDescription()); dto.setCost(r.getCost()); dto.setServiceProvider(r.getServiceProvider()); dto.setPartsReplaced(r.getPartsReplaced());
        dto.setNextScheduledDate(r.getNextScheduledDate()); return dto;
    }

    private DocumentDTO toDocument(Document d) {
        return new DocumentDTO(String.valueOf(d.getId()), d.getName(), d.getFileType(), d.getFileUrl(), d.getFileSize(), d.getUploadDate());
    }
}
