package com.warrantyhub.exception;

import lombok.Data;

import java.util.Date;
@Data
public class ErrorDetails {
    private boolean success = false;
    private Date timestamp;
    private String message;
    private String details;
    private int status;


    // All-args constructor
    public ErrorDetails(Date timestamp, String message, String details, int status) {
        this.timestamp = timestamp;
        this.message = message;
        this.details = details;
        this.status = status;
    }
}
