package com.warrantyhub.security.oauth2;

import com.warrantyhub.model.RefreshToken;
import com.warrantyhub.model.User;
import com.warrantyhub.model.enums.Provider;
import com.warrantyhub.repository.RefreshTokenRepository;
import com.warrantyhub.security.JwtTokenProvider;
import com.warrantyhub.security.UserPrincipal;
import com.warrantyhub.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.Optional;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private HttpCookieOAuth2AuthorizationRequestRepository authorizationRequestRepository;

    @Value("${app.oauth2.defaultFrontendUrl}")
    private String defaultFrontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        String referer = request.getHeader("Referer");
        if (referer != null && referer.contains("swagger-ui")) {
            handleSwaggerSuccess(request, response, authentication);
        } else {
            handleReactSuccess(request, response, authentication);
        }
    }

    private void handleSwaggerSuccess(HttpServletRequest request, HttpServletResponse response,
                                      Authentication authentication) throws IOException {
        try {
            String token = tokenProvider.generateToken(authentication);

            String email = extractEmail(authentication);
            String name = extractName(authentication);
            Long userId = getUserIdFromAuthentication(authentication);

            Map<String, Object> tokenInfo = new HashMap<>();
            tokenInfo.put("access_token", token);
            tokenInfo.put("token_type", "Bearer");
            tokenInfo.put("expires_in", 86400);
            tokenInfo.put("user", Map.of(
                    "id", userId != null ? userId : "unknown",
                    "name", name != null ? name : "Unknown User",
                    "email", email != null ? email : "unknown@example.com"
            ));

            authorizationRequestRepository.removeAuthorizationRequestCookies(request, response);

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.setStatus(HttpServletResponse.SC_OK);

            ObjectMapper mapper = new ObjectMapper();
            String jsonResponse = mapper.writeValueAsString(tokenInfo);
            response.getWriter().write(jsonResponse);
            response.getWriter().flush();

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Token generation failed\",\"message\":\"" + e.getMessage() + "\"}");
            response.getWriter().flush();
        }
    }

    private void handleReactSuccess(HttpServletRequest request, HttpServletResponse response,
                                    Authentication authentication) throws IOException {
        String targetUrl = determineTargetUrl(request, response, authentication);

        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        clearAuthenticationAttributes(request);
        authorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) {
        try {
            String token = tokenProvider.generateToken(authentication);
            String refreshToken = createRefreshTokenForOAuth2User(authentication);
            return UriComponentsBuilder.fromUriString(defaultFrontendUrl + "/oauth2/callback")
                    .queryParam("token", token)
                    .queryParam("refreshToken", refreshToken)
                    .queryParam("success", "true")
                    .build().toUriString();

        } catch (Exception e) {
            return UriComponentsBuilder.fromUriString(defaultFrontendUrl + "/login")
                    .queryParam("error", "token_generation_failed")
                    .queryParam("message", e.getMessage())
                    .build().toUriString();
        }
    }

    private String extractEmail(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserPrincipal) {
            return ((UserPrincipal) principal).getEmail();
        } else if (principal instanceof OidcUser) {
            return ((OidcUser) principal).getEmail();
        } else if (principal instanceof OAuth2User) {
            return ((OAuth2User) principal).getAttribute("email");
        }
        return null;
    }

    private String extractName(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserPrincipal) {
            return ((UserPrincipal) principal).getName();
        } else if (principal instanceof OidcUser) {
            return ((OidcUser) principal).getFullName();
        } else if (principal instanceof OAuth2User) {
            return ((OAuth2User) principal).getAttribute("name");
        }
        return null;
    }

    private String extractProviderId(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserPrincipal) {
            return null;
        } else if (principal instanceof OidcUser) {
            return ((OidcUser) principal).getSubject();
        } else if (principal instanceof OAuth2User) {
            return ((OAuth2User) principal).getAttribute("sub");
        }

        return null;
    }

    private Long getUserIdFromAuthentication(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserPrincipal) {
            return ((UserPrincipal) principal).getId();
        }

        String email = extractEmail(authentication);
        if (email != null) {
            try {
                User user = userService.findByEmail(email);
                return user.getId();
            } catch (Exception e) {
                logger.debug("Could not find user ID for OAuth2 user: {}");
            }
        }

        return null;
    }

    @Transactional
    protected String createRefreshTokenForOAuth2User(Authentication authentication) {
        try {
            String email = extractEmail(authentication);
            if (email == null || email.trim().isEmpty()) {
                throw new IllegalArgumentException("Email cannot be null or empty");
            }

            User user;
            try {
                user = userService.findByEmail(email.trim());
            } catch (Exception e) {
                String name = extractName(authentication);
                String providerId = extractProviderId(authentication);

                user = userService.findOrCreateOAuth2User(
                        email.trim(),
                        name,
                        Provider.GOOGLE,
                        providerId
                );
            }
            RefreshToken refreshToken;
            Optional<RefreshToken> existingTokenOptional = refreshTokenRepository.findByUser(user);

            if (existingTokenOptional.isPresent()) {
                refreshToken = existingTokenOptional.get();
            } else {
                refreshToken = new RefreshToken();
                refreshToken.setUser(user);
            }

            refreshToken.setToken(UUID.randomUUID().toString());
            refreshToken.setExpiryDate(Instant.now().plusSeconds(604800));
            RefreshToken savedToken = refreshTokenRepository.save(refreshToken);

            return savedToken.getToken();

        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Database constraint violation while creating refresh token", e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create refresh token", e);
        }
    }
}