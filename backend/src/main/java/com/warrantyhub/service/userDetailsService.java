package com.warrantyhub.service;

import com.warrantyhub.model.User;
import com.warrantyhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collection;

/**
 * Service implementation for loading user details for Spring Security.
 * Spring Security to retrieve user information, such as username, password,
 * and authorities, for authentication and authorization.
 */
@Service
public class userDetailsService implements UserDetailsService {

    // Assuming a UserRepository exists to interact with the database.
    // This repository should have a method to find a User by their email.
    private final UserRepository userRepository;

    @Autowired
    public userDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        try {
            // Input validation
            if (email == null || email.trim().isEmpty()) {
                throw new UsernameNotFoundException("Email cannot be null or empty");
            }

            // Find user by email
            User user = userRepository.findByEmail(email.trim())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

            // CRITICAL FIX: Ensure username is never null or empty
            String username = user.getEmail();
            if (username == null || username.trim().isEmpty()) {
                throw new UsernameNotFoundException("User email is null or empty in database");
            }

            // CRITICAL FIX: Handle password for OAuth2 users
            String password = user.getPassword();
            if (password == null || password.trim().isEmpty()) {
                // OAuth2 users don't have passwords, provide placeholder
                password = "{noop}OAUTH_USER";
            }

            // CRITICAL FIX: Ensure authorities are never null or empty
            Collection<? extends GrantedAuthority> authorities = Arrays.asList(new SimpleGrantedAuthority("ROLE_USER"));

            // Build UserDetails with validated parameters
            return org.springframework.security.core.userdetails.User.builder()
                    .username(username.trim())  // Never null or empty
                    .password(password)         // Never null or empty
                    .authorities(authorities)   // Never null or empty
                    .disabled(!Boolean.TRUE.equals(user.isEnabled()))
                    .accountExpired(false)
                    .accountLocked(false)
                    .credentialsExpired(false)
                    .build();

        } catch (UsernameNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new UsernameNotFoundException("Error loading user details", e);
        }
    }

}
