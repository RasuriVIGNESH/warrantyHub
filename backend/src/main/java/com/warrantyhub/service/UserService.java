package com.warrantyhub.service;

import com.warrantyhub.dto.request.UserProfileUpdateRequest;
import com.warrantyhub.dto.response.UserProfileDTO;
import com.warrantyhub.exception.ResourceNotFoundException;
import com.warrantyhub.model.enums.Provider;
import com.warrantyhub.model.User;
import com.warrantyhub.model.UserPreferences;
import com.warrantyhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.Collection;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public Optional<User> findUserByEmailOptional(String email) {
        if (email == null || email.trim().isEmpty()) {
            return Optional.empty();
        }

        return userRepository.findByEmail(email.trim());
    }
    public void saveUser(User user) {
        try {
            if (user == null) {
               throw new IllegalArgumentException("User cannot be null");
            }

            if (user.getPreferences() == null) {
               user.setPreferences(new UserPreferences());
            }

            userRepository.save(user);

        } catch (Exception e) {
            throw e;
        }
    }

    public UserProfileDTO getUserProfile(Authentication authentication) {
        User user = getUserFromAuthentication(authentication);

        UserProfileDTO profileDTO = new UserProfileDTO();
        profileDTO.setId(user.getId().toString());
        profileDTO.setName(user.getName());
        profileDTO.setEmail(user.getEmail());
        profileDTO.setEmailNotifications(user.getPreferences().isEmailNotifications());
        profileDTO.setWarrantyExpirationReminders(user.getPreferences().getWarrantyExpirationReminders());


        return profileDTO;
    }

    public UserProfileDTO updateUserProfile(UserProfileUpdateRequest request, Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);

            boolean hasChanges = false;

            if (request.getName() != null && !request.getName().isEmpty() && !request.getName().equals(user.getName())) {
                user.setName(request.getName());
                hasChanges = true;
            }

            UserPreferences preferences = user.getPreferences();
            if (preferences.isEmailNotifications() != request.isEmailNotifications()) {
                preferences.setEmailNotifications(request.isEmailNotifications());
                hasChanges = true;
            }

            if (preferences.getWarrantyExpirationReminders() != request.getWarrantyExpirationReminders()) {
                preferences.setWarrantyExpirationReminders(request.getWarrantyExpirationReminders());
                hasChanges = true;
            }

            User updatedUser = userRepository.save(user);

            UserProfileDTO profileDTO = new UserProfileDTO();
            profileDTO.setId(updatedUser.getId().toString());
            profileDTO.setName(updatedUser.getName());
            profileDTO.setEmail(updatedUser.getEmail());
            profileDTO.setEmailNotifications(updatedUser.getPreferences().isEmailNotifications());
            profileDTO.setWarrantyExpirationReminders(updatedUser.getPreferences().getWarrantyExpirationReminders());

            return profileDTO;

        } catch (Exception e) {
            throw e;
        }
    }

    public User findOrCreateOAuth2User(String email, String name, Provider provider, String providerId) {
        try {
            // IMPROVED: Input validation
            if (email == null || email.trim().isEmpty()) {
                throw new IllegalArgumentException("Email cannot be null or empty");
            }

            if (providerId == null || providerId.trim().isEmpty()) {
                // logger.error("findOrCreateOAuth2User called with null or empty providerId for email: {}", maskEmail(email));
                throw new IllegalArgumentException("Provider ID cannot be null or empty");
            }

            String normalizedEmail = email.trim().toLowerCase();
            Optional<User> existingUser = userRepository.findByEmail(normalizedEmail);

            if (existingUser.isPresent()) {
                User user = existingUser.get();
                boolean needsUpdate = false;

                // IMPROVED: Update provider info if changed
                if (user.getProvider() == null || !user.getProvider().equals(provider)) {
                    user.setProvider(provider);
                    needsUpdate = true;
                }

                if (user.getProviderId() == null || !user.getProviderId().equals(providerId)) {
                    user.setProviderId(providerId);
                    needsUpdate = true;
                }

                // Update name if it was null or empty and we have a valid name now
                if ((user.getName() == null || user.getName().trim().isEmpty()) &&
                        name != null && !name.trim().isEmpty()) {
                    user.setName(name.trim());
                    needsUpdate = true;
                }

                if (needsUpdate) {
                    user = userRepository.save(user);
                }

                return user;

            } else {
                // IMPROVED: Create new OAuth2 user with better defaults
                User newUser = new User();
                newUser.setName(name != null && !name.trim().isEmpty() ? name.trim() : normalizedEmail.split("@")[0]);
                newUser.setEmail(normalizedEmail);
                newUser.setProvider(provider);
                newUser.setProviderId(providerId.trim());
                newUser.setEnabled(true);

                // Create default preferences
                UserPreferences preferences = new UserPreferences();
                preferences.setEmailNotifications(true);
                preferences.setWarrantyExpirationReminders(30);
                newUser.setPreferences(preferences);

                User savedUser = userRepository.save(newUser);
                return savedUser;
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to find or create OAuth2 user", e);
        }
    }

    /**
     * IMPROVED: Enhanced UserDetailsService implementation with better error handling
     */

    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        try {
            // IMPROVED: Input validation with detailed logging
            if (email == null || email.trim().isEmpty()) {
                throw new UsernameNotFoundException("Email cannot be null or empty");
            }

            String normalizedEmail = email.trim();

            // Find user by email
            User user = userRepository.findByEmail(normalizedEmail)
                    .orElseThrow(() -> {
                        return new UsernameNotFoundException("User not found with email: " + maskEmail(normalizedEmail));
                    });

            // IMPROVED: Database integrity validation
            String username = user.getEmail();
            if (username == null || username.trim().isEmpty()) {
                throw new UsernameNotFoundException("User email is null or empty in database");
            }

            // Handle password properly - OAuth2 users might not have passwords
            String password = user.getPassword();
            if (password == null || password.trim().isEmpty()) {
                password = "{noop}OAUTH_USER";
            }

            // Ensure authorities are never null or empty
            Collection<? extends GrantedAuthority> authorities = getAuthorities();

            boolean enabled = Boolean.TRUE.equals(user.isEnabled());

            // Build the UserDetails object with proper null checks
            return org.springframework.security.core.userdetails.User.builder()
                    .username(username.trim())
                    .password(password)
                    .authorities(authorities)
                    .disabled(!enabled)
                    .accountExpired(false)
                    .accountLocked(false)
                    .credentialsExpired(false)
                    .build();

        } catch (UsernameNotFoundException e) {
            // Re-throw username not found exceptions
            throw e;
        } catch (Exception e) {
            throw new UsernameNotFoundException("Error loading user details", e);
        }
    }

    /**
     * Helper method to get default authorities for authenticated users
     */
    private Collection<? extends GrantedAuthority> getAuthorities() {
        return Arrays.asList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    public User findByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }

        return userRepository.findByEmail(email.trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + maskEmail(email)));
    }

    private User getUserFromAuthentication(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResourceNotFoundException("Authentication object or principal name is null.");
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email.trim())
                .orElseThrow(() -> {
                    return new ResourceNotFoundException("User not found for authenticated principal: " + maskEmail(email));
                });
    }

    /**
     * ADDED: Utility method to mask email for secure logging
     */
    private String maskEmail(String email) {
        if (email == null || email.length() < 3) {
            return "***";
        }

        int atIndex = email.indexOf('@');
        if (atIndex <= 0) {
            return email.substring(0, 1) + "***";
        }

        String localPart = email.substring(0, atIndex);
        String domain = email.substring(atIndex);

        if (localPart.length() <= 2) {
            return localPart.charAt(0) + "***" + domain;
        } else {
            return localPart.charAt(0) + "***" + localPart.charAt(localPart.length() - 1) + domain;
        }
    }
}