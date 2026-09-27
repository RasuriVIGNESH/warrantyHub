package com.warrantyhub.repository;
import com.warrantyhub.model.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByUserIdOrderByUpdatedAtDesc(Long userId);
    Optional<Claim> findByIdAndUserId(Long id, Long userId);
}
