package com.warrantyhub.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Decoders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private int jwtExpirationInMs;

    /**
     * FIXED: Generate JWT token that handles both UserDetails and OAuth2User principals
     */
    public String generateToken(Authentication authentication) {
        try {
            Object principal = authentication.getPrincipal();
            String email;
            String name = null;

            // Handle different principal types
            if (principal instanceof UserPrincipal) {
                // Custom UserPrincipal (implements both UserDetails and OAuth2User)
                UserPrincipal userPrincipal = (UserPrincipal) principal;
                email = userPrincipal.getEmail();
                name = userPrincipal.getName();

            } else if (principal instanceof OidcUser) {
                // OAuth2/OIDC user (Google login)
                OidcUser oidcUser = (OidcUser) principal;
                email = oidcUser.getEmail();
                name = oidcUser.getFullName();

            } else if (principal instanceof OAuth2User) {
                // Generic OAuth2 user
                OAuth2User oauth2User = (OAuth2User) principal;
                email = oauth2User.getAttribute("email");
                name = oauth2User.getAttribute("name");

            } else if (principal instanceof UserDetails) {
                // Standard UserDetails (email/password login)
                UserDetails userDetails = (UserDetails) principal;
                email = userDetails.getUsername();

            } else {
                throw new RuntimeException("Unsupported principal type: " + principal.getClass());
            }

            // Validate email
            if (email == null || email.trim().isEmpty()) {
                throw new RuntimeException("User email cannot be null or empty");
            }

            // Generate token
            Date now = new Date();
            Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

            String token = Jwts.builder()
                    .setSubject(email.trim())
                    .claim("email", email.trim())
                    .claim("name", name) // Include name if available
                    .setIssuedAt(now)
                    .setExpiration(expiryDate)
                    .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                    .compact();

            return token;

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate JWT token", e);
        }
    }

    // Generate token from username (for refresh token etc.)
    public String generateTokenFromUsername(String username) {
        try {
            // IMPROVED: Input validation
            if (username == null || username.trim().isEmpty()) {
                throw new IllegalArgumentException("Username cannot be null or empty");
            }

            Date now = new Date();
            Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

            String token = Jwts.builder()
                    .setSubject(username.trim())
                    .claim("email", username.trim())
                    .setIssuedAt(now)
                    .setExpiration(expiryDate)
                    .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                    .compact();

            return token;

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate JWT token from username", e);
        }
    }

    // Get username (email) from JWT token
    public String getUsernameFromJWT(String token) {
        try {
            // IMPROVED: Input validation
            if (token == null || token.trim().isEmpty()) {
                throw new IllegalArgumentException("Token cannot be null or empty");
            }

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token.trim())
                    .getBody();

            // ✅ Prefer email claim if present, fallback to subject
            String email = claims.get("email", String.class);
            if (email != null && !email.trim().isEmpty()) {
                return email.trim();
            }

            String subject = claims.getSubject();
            if (subject == null || subject.trim().isEmpty()) {
                throw new RuntimeException("Invalid JWT token: no valid subject or email");
            }

            return subject.trim();

        } catch (ExpiredJwtException e) {
            throw new RuntimeException("JWT token is expired", e);
        } catch (MalformedJwtException e) {
            throw new RuntimeException("Invalid JWT token format", e);
        } catch (UnsupportedJwtException e) {
            throw new RuntimeException("Unsupported JWT token", e);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid JWT token claims", e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract username from JWT token", e);
        }
    }

    // Validate JWT token
    public boolean validateToken(String authToken) {
        try {
            // IMPROVED: Input validation
            if (authToken == null || authToken.trim().isEmpty()) {
                return false;
            }

            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
            .parseClaimsJws(authToken.trim());

            return true;

        } catch (MalformedJwtException ex) {
        } catch (ExpiredJwtException ex) {
        } catch (UnsupportedJwtException ex) {
        } catch (IllegalArgumentException ex) {
        } catch (Exception ex) {
        }

        return false;
    }

    // Build Authentication from JWT
    public Authentication getAuthentication(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Collection<? extends GrantedAuthority> authorities = Arrays.stream(
                            (claims.get("roles", String.class) != null ? claims.get("roles", String.class) : "")
                                    .split(","))
                    .filter(role -> !role.isEmpty())
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());

            // IMPROVED: Add default role if no roles specified
            if (authorities.isEmpty()) {
                authorities = Arrays.asList(new SimpleGrantedAuthority("ROLE_USER"));
            }

            String username = getUsernameFromJWT(token);
            User principal = new User(username, "", authorities);

            return new UsernamePasswordAuthenticationToken(principal, token, authorities);

        } catch (Exception e) {
            throw new RuntimeException("Failed to create authentication from JWT token", e);
        }
    }

    /**
     * IMPROVED: Get expiration date from token for frontend usage
     */
    public Date getExpirationDateFromJWT(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getExpiration();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * IMPROVED: Check if token is expired without throwing exception
     */
    public boolean isTokenExpired(String token) {
        try {
            Date expiration = getExpirationDateFromJWT(token);
            return expiration != null && expiration.before(new Date());
        } catch (Exception e) {
            return true; // Consider invalid tokens as expired
        }
    }

    private SecretKey getSigningKey() {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create JWT signing key", e);
        }
    }
}