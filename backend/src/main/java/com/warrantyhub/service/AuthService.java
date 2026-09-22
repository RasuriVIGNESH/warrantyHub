package com.warrantyhub.service;

import com.warrantyhub.dto.request.LoginRequest;
import com.warrantyhub.dto.request.RegisterRequest;
import com.warrantyhub.dto.response.ApiResponse;
import com.warrantyhub.dto.response.AuthResponse;
import com.warrantyhub.dto.response.TokenRefreshResponse;
import com.warrantyhub.dto.response.UserDTO;
import com.warrantyhub.dto.response.UserProfileDTO;
import com.warrantyhub.model.RefreshToken;
import com.warrantyhub.model.User;
import com.warrantyhub.model.UserPreferences;
import com.warrantyhub.exception.BadRequestException;
import com.warrantyhub.exception.ResourceNotFoundException;
import com.warrantyhub.exception.UnauthorizedException;
import com.warrantyhub.repository.RefreshTokenRepository;
import com.warrantyhub.repository.UserRepository;
import com.warrantyhub.security.JwtTokenProvider;
import com.warrantyhub.security.UserPrincipal;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final ModelMapper modelMapper;
    private final EmailService emailService;

    @Autowired
    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider,
            RefreshTokenRepository refreshTokenRepository,
            ModelMapper modelMapper,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.refreshTokenRepository = refreshTokenRepository;
        this.modelMapper = modelMapper;
        this.emailService = emailService;
    }


    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email is already taken");
        }

        // Create new user
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        // Initialize user preferences
        UserPreferences preferences = new UserPreferences();
        preferences.setEmailNotifications(true);
        preferences.setWarrantyExpirationReminders(30);
        user.setPreferences(preferences);

        User savedUser = userRepository.save(user);

        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getEmail(),
                        registerRequest.getPassword()
                )
        );

        // Generate JWT token
        String jwt = tokenProvider.generateToken(authentication);

        // Create refresh token
        RefreshToken refreshToken = createRefreshToken(savedUser);

        // Send welcome email
        emailService.sendWelcomeEmail(savedUser);

        // Return response
        UserProfileDTO userProfileDTO = new UserProfileDTO();
        userProfileDTO.setId(savedUser.getId().toString());
        userProfileDTO.setName(savedUser.getName());
        userProfileDTO.setEmail(savedUser.getEmail());
        userProfileDTO.setEmailNotifications(savedUser.getPreferences().isEmailNotifications());
        userProfileDTO.setWarrantyExpirationReminders(savedUser.getPreferences().getWarrantyExpirationReminders());

        // Convert UserProfileDTO to UserDTO for AuthResponse
        UserDTO userDTO = new UserDTO();
        userDTO.setId(userProfileDTO.getId());
        userDTO.setName(userProfileDTO.getName());
        userDTO.setEmail(userProfileDTO.getEmail());

        return new AuthResponse(true, userDTO, jwt, refreshToken.getToken());
    }

    @Transactional
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication;
        try {
            // Authenticate user
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
        } catch (BadCredentialsException ex) {
            throw new BadRequestException("Invalid email or password");
        }

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Generate JWT token
        String jwt = tokenProvider.generateToken(authentication);

        // Create refresh token
        RefreshToken refreshToken = createRefreshToken(user);

        // Return response
        UserProfileDTO userProfileDTO = new UserProfileDTO();
        userProfileDTO.setId(user.getId().toString());
        userProfileDTO.setName(user.getName());
        userProfileDTO.setEmail(user.getEmail());
        userProfileDTO.setEmailNotifications(user.getPreferences().isEmailNotifications());
        userProfileDTO.setWarrantyExpirationReminders(user.getPreferences().getWarrantyExpirationReminders());

        // Convert UserProfileDTO to UserDTO for AuthResponse
        UserDTO userDTO = new UserDTO();
        userDTO.setId(userProfileDTO.getId());
        userDTO.setName(userProfileDTO.getName());
        userDTO.setEmail(userProfileDTO.getEmail());

        return new AuthResponse(true, userDTO, jwt, refreshToken.getToken());
    }

    @Transactional
    public TokenRefreshResponse refreshToken(String refreshToken) {
        return refreshTokenRepository.findByToken(refreshToken)
                .map(this::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = tokenProvider.generateTokenFromUsername(user.getEmail());
                    return new TokenRefreshResponse(true, token, refreshToken);
                })
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));
    }

    @Transactional
    public ApiResponse requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        String resetToken = UUID.randomUUID().toString();
        user.setResetPasswordToken(resetToken);
        user.setResetPasswordTokenExpiry(Instant.now().plusSeconds(3600)); // 1 hour
        userRepository.save(user);

        // Send password reset email
        emailService.sendPasswordResetEmail(user, resetToken);

        return new ApiResponse(true, "Password reset link sent to email");
    }

    @Transactional
    public ApiResponse resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid reset token"));

        // Check if token is expired
        if (user.getResetPasswordTokenExpiry().isBefore(Instant.now())) {
            throw new BadRequestException("Reset token has expired");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);

        return new ApiResponse(true, "Password reset successful");
    }

    @Transactional
    public ApiResponse logout() {
        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            return new ApiResponse(true, "Logout successful (no session)");
        }
        String email = authentication.getName();

        // Delete refresh token
        Optional<User> user = userRepository.findByEmail(email);
        user.ifPresent(refreshTokenRepository::deleteByUser);

        return new ApiResponse(true, "Logout successful");
    }


    public UserProfileDTO getProfile(Authentication authentication) {
        // Ensure authentication object is not null and contains a principal name
        if (authentication == null || authentication.getName() == null || authentication.getName().isEmpty()) {
            throw new UnauthorizedException("User is not authenticated or authentication details are missing.");
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found for authenticated principal: " + authentication.getName()));

        UserProfileDTO profileDTO = new UserProfileDTO();
        profileDTO.setId(user.getId().toString());
        profileDTO.setName(user.getName());
        profileDTO.setEmail(user.getEmail());
        // Ensure preferences are not null before accessing them
        if (user.getPreferences() != null) {
            profileDTO.setEmailNotifications(user.getPreferences().isEmailNotifications());
            profileDTO.setWarrantyExpirationReminders(user.getPreferences().getWarrantyExpirationReminders());
        } else {
            // Handle case where preferences might be null (e.g., set default values or log a warning)
            profileDTO.setEmailNotifications(false); // Default value
            profileDTO.setWarrantyExpirationReminders(0); // Default value
        }

        return profileDTO;
    }

    private RefreshToken createRefreshToken(User user) {
        Optional<RefreshToken> existingToken = refreshTokenRepository.findByUser(user);

        RefreshToken refreshToken;
        if (existingToken.isPresent()) {
            refreshToken = existingToken.get();
            // Update the existing token's properties
            refreshToken.setToken(UUID.randomUUID().toString());
            refreshToken.setExpiryDate(Instant.now().plusSeconds(604800)); // 7 days
        } else {
            // Create a new token if none exists
            refreshToken = new RefreshToken();
            refreshToken.setUser(user);
            refreshToken.setToken(UUID.randomUUID().toString());
            refreshToken.setExpiryDate(Instant.now().plusSeconds(604800)); // 7 days
        }

        // Save (this will update if existing, insert if new)
        return refreshTokenRepository.save(refreshToken);
    }

    private RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new UnauthorizedException("Refresh token has expired. Please login again");
        }
        return token;
    }
}