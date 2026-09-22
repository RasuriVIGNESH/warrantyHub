package com.warrantyhub.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class    UserPreferences {
    private boolean emailNotifications = true;
    private int warrantyExpirationReminders = 30;
    
    // No-args constructor
    public UserPreferences() {
    }
    
    // All-args constructor
    public UserPreferences(boolean emailNotifications, int warrantyExpirationReminders) {
        this.emailNotifications = emailNotifications;
        this.warrantyExpirationReminders = warrantyExpirationReminders;
    }
    
    // Getters and Setters
    public boolean isEmailNotifications() {
        return emailNotifications;
    }
    
    public void setEmailNotifications(boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }
    
    public int getWarrantyExpirationReminders() {
        return warrantyExpirationReminders;
    }
    
    public void setWarrantyExpirationReminders(int warrantyExpirationReminders) {
        this.warrantyExpirationReminders = warrantyExpirationReminders;
    }
}
