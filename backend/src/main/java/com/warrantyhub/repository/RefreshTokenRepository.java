package com.warrantyhub.repository;

import com.warrantyhub.model.RefreshToken;
import com.warrantyhub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    /**
     * Find refresh token by token string
     */
    Optional<RefreshToken> findByToken(String token);

    /**
     * Find refresh token by user - REQUIRED for OAuth2 flow
     * This method is crucial for avoiding database constraint violations
     */
    Optional<RefreshToken> findByUser(User user);

    /**
     * Delete refresh token by user
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM RefreshToken rt WHERE rt.user = :user")
    void deleteByUser(@Param("user") User user);

    /**
     * Delete refresh token by token string
     */
    @Modifying
    @Transactional
    void deleteByToken(String token);
}