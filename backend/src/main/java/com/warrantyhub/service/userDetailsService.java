package com.warrantyhub.service;

import com.warrantyhub.model.User;
import com.warrantyhub.repository.UserRepository;
import com.warrantyhub.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


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
        if (email == null || email.trim().isEmpty()) {
            throw new UsernameNotFoundException("Email cannot be null or empty");
        }

        User user = userRepository.findByEmail(email.trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return UserPrincipal.create(user);
    }

}
