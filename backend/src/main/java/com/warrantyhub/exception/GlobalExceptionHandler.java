package com.warrantyhub.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

  // Handle Resource Not Found
  @ExceptionHandler(ResourceNotFoundException.class )
  public ResponseEntity<ErrorDetails> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
    ErrorDetails errorDetails = new ErrorDetails(new Date(), ex.getMessage(), request.getDescription(false), HttpStatus.NOT_FOUND.value());
    return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
  }

  // Handle Bad Request
  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<ErrorDetails> handleBadRequestException(BadRequestException ex, WebRequest request) {
    ErrorDetails errorDetails = new ErrorDetails(new Date(), ex.getMessage(), request.getDescription(false), HttpStatus.BAD_REQUEST.value());
    return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
  }

  // Handle Unauthorized
  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<ErrorDetails> handleUnauthorizedException(UnauthorizedException ex, WebRequest request) {
    ErrorDetails errorDetails = new ErrorDetails(new Date(), ex.getMessage(), request.getDescription(false), HttpStatus.UNAUTHORIZED.value());
    return new ResponseEntity<>(errorDetails, HttpStatus.UNAUTHORIZED);
  }

  // Handle JWT Exceptions
  @ExceptionHandler(JwtException.class)
  public ResponseEntity<ErrorDetails> handleJwtException(JwtException ex, WebRequest request) {
    ErrorDetails errorDetails = new ErrorDetails(new Date(), ex.getMessage(), request.getDescription(false), HttpStatus.UNAUTHORIZED.value());
    return new ResponseEntity<>(errorDetails, HttpStatus.UNAUTHORIZED);
  }

  // Handle Spring Security Authentication Errors
  @ExceptionHandler({AuthenticationException.class, BadCredentialsException.class})
  public ResponseEntity<ErrorDetails> handleAuthenticationException(Exception ex, WebRequest request) {
    String message = (ex instanceof BadCredentialsException) ? "Invalid email or password" : "Authentication failed: " + ex.getMessage();
    ErrorDetails errorDetails = new ErrorDetails(new Date(), message, request.getDescription(false), HttpStatus.UNAUTHORIZED.value());
    return new ResponseEntity<>(errorDetails, HttpStatus.UNAUTHORIZED);
  }

  // Handle Access Denied
  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ErrorDetails> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
    ErrorDetails errorDetails = new ErrorDetails(new Date(), "Access denied: " + ex.getMessage(), request.getDescription(false), HttpStatus.FORBIDDEN.value());
    return new ResponseEntity<>(errorDetails, HttpStatus.FORBIDDEN);
  }

  // Handle Method Argument Validation Errors (@Valid)
  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach((error) -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
    });
    ValidationErrorDetails errorDetails = new ValidationErrorDetails(new Date(), "Validation failed", request.getDescription(false), HttpStatus.BAD_REQUEST.value(), errors);
    return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
  }

  // Handle Constraint Violation Errors (@Validated)
  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ValidationErrorDetails> handleConstraintViolationException(ConstraintViolationException ex, WebRequest request) {
    Map<String, String> errors = new HashMap<>();
    ex.getConstraintViolations().forEach(violation -> {
      String fieldName = violation.getPropertyPath().toString();
      String errorMessage = violation.getMessage();
      errors.put(fieldName, errorMessage);
    });
    ValidationErrorDetails errorDetails = new ValidationErrorDetails(new Date(), "Validation failed", request.getDescription(false), HttpStatus.BAD_REQUEST.value(), errors);
    return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
  }

  // Handle Missing Parameters
  @Override
  protected ResponseEntity<Object> handleMissingServletRequestParameter(MissingServletRequestParameterException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
    ErrorDetails errorDetails = new ErrorDetails(new Date(), "Required parameter \'" + ex.getParameterName() + "\' is missing", request.getDescription(false), HttpStatus.BAD_REQUEST.value());
    return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
  }

  // Handle File Storage Errors
  @ExceptionHandler(FileStorageException.class)
  public ResponseEntity<ErrorDetails> handleFileStorageException(FileStorageException ex, WebRequest request) {
    ErrorDetails errorDetails = new ErrorDetails(new Date(), ex.getMessage(), request.getDescription(false), HttpStatus.INTERNAL_SERVER_ERROR.value());
    return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  // Handle All Other Exceptions
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorDetails> handleGlobalException(Exception ex, WebRequest request) {
    ErrorDetails errorDetails = new ErrorDetails(new Date(), "An unexpected error occurred: " + ex.getMessage(), request.getDescription(false), HttpStatus.INTERNAL_SERVER_ERROR.value());
    return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
