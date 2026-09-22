package com.warrantyhub.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.security.OAuthFlow;
import io.swagger.v3.oas.annotations.security.OAuthFlows;
import io.swagger.v3.oas.annotations.security.OAuthScope;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.servers.Server;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "WarrantyHub API",
                version = "1.0.0",
                description = "WarrantyHub API with JWT and OAuth2 authentication support"
        )
)
@SecurityScheme(
        name = "Bearer Authentication",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT",
        description = "JWT token obtained from /api/auth/login or /api/auth/register endpoint. Also returned after successful OAuth2 login."
)
@SecurityScheme(
        name = "Google OAuth2",
        type = SecuritySchemeType.OAUTH2,
        flows = @OAuthFlows(
                authorizationCode = @OAuthFlow(
                        authorizationUrl = "https://accounts.google.com/o/oauth2/v2/auth",
                        tokenUrl = "https://oauth2.googleapis.com/token",
                        scopes = {
                                @OAuthScope(name = "openid", description = "OpenID Connect scope"),
                                @OAuthScope(name = "profile", description = "Access to user profile information"),
                                @OAuthScope(name = "email", description = "Access to user email address")
                        }
                )
        ),
        description = "Google OAuth2 authentication. After successful authentication, you'll be redirected to /dashboard with JWT tokens."
)
public class SwaggerConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .servers(List.of(
                        new Server().url("http://localhost:" + serverPort).description("Development Server")
                ))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .addSecurityItem(new SecurityRequirement().addList("Google OAuth2"));
    }
}