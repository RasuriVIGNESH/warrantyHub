package com.warrantyhub.repository;

import com.warrantyhub.model.Device;
import com.warrantyhub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    List<Device> findByUser(User user);
    List<Device> findByWarrantyEndDateBetween(LocalDate start, LocalDate end);

    @Query("SELECT DISTINCT d FROM Device d " +
            "LEFT JOIN FETCH d.maintenanceHistory " +
            "LEFT JOIN FETCH d.documents " +
            "WHERE d.user = :user")
    List<Device> findByUserWithDetails(@Param("user") User user);

}
