package com.warrantyhub.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.warrantyhub.exception.ErrorDetails;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Date;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException ) throws IOException, ServletException {

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        final Exception exception = (Exception) request.getAttribute("exception");
        String message;

        if (exception != null) {
            message = exception.getMessage();
        } else if (authException.getCause() != null) {
            message = authException.getCause().getMessage();
        } else {
            message = authException.getMessage();
        }

        ErrorDetails errorDetails = new ErrorDetails(
                new Date(),
                message,
                request.getServletPath(),
                HttpServletResponse.SC_UNAUTHORIZED
        );

        final ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(response.getOutputStream(), errorDetails);
    }
}
