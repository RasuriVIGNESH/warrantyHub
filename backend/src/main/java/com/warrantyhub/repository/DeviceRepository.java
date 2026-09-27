package com.warrantyhub.repository;

import com.warrantyhub.model.Device;
import com.warrantyhub.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    @EntityGraph(attributePaths = {"documents", "maintenanceHistory"})
    @Query("select distinct d from Device d where d.user = :user")
    List<Device> findByUserWithDetails(@Param("user") User user);

    @EntityGraph(attributePaths = {"documents", "maintenanceHistory"})
    @Query("select distinct d from Device d where d.id = :id")
    Optional<Device> findByIdWithDetails(@Param("id") Long id);
}
