package com.warrantyhub.exception;

import java.util.Date;
import java.util.Map;

public class ValidationErrorDetails extends ErrorDetails {
  private Map<String, String> errors;

  public ValidationErrorDetails(Date timestamp, String message, String details, int status, Map<String, String> errors) {
    super(timestamp, message, details, status);
    this.errors = errors;
  }
  
  // Getters and Setters
  public Map<String, String> getErrors() {
    return errors;
  }
  
  public void setErrors(Map<String, String> errors) {
    this.errors = errors;
  }
}
