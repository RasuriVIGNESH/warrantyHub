package com.warrantyhub.service;

import com.warrantyhub.model.Device;
import com.warrantyhub.repository.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class WarrantyStatusScheduler {

    private final DeviceRepository deviceRepository;

    @Autowired
    public WarrantyStatusScheduler(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    /**
     * Update warranty status for all devices daily at 2 AM.
     * Ensures warranty expiry is detected and reflected in real-time.
     */
    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void updateAllDevicesWarrantyStatus() {
        List<Device> allDevices = deviceRepository.findAll();
        for (Device device : allDevices) {
            device.updateWarrantyStatus();
        }
        deviceRepository.saveAll(allDevices);
    }
}
