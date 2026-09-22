package com.warrantyhub.service;

import com.warrantyhub.model.Device;
import com.warrantyhub.model.MaintenanceRecord;
import com.warrantyhub.model.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.email.sender-name}")
    private String senderName;

    public EmailService(JavaMailSender mailSender, SpringTemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Async
    public void sendWelcomeEmail(User user) {
        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("name", user.getName());
        templateModel.put("email", user.getEmail());

        sendHtmlMessage(
                user.getEmail(),
                "Welcome to WarrantyHub!",
                "welcome",
                templateModel
        );
    }

    @Async
    public void sendPasswordResetEmail(User user, String resetToken) {
        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("name", user.getName());
        templateModel.put("resetToken", resetToken);
        templateModel.put("email", user.getEmail());

        sendHtmlMessage(
                user.getEmail(),
                "Reset Your Password",
                "reset-password",
                templateModel
        );
    }

    @Async
    public void sendWarrantyExpirationReminder(User user, Device device, int daysRemaining) {
        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("name", user.getName());
        templateModel.put("deviceName", device.getName());
        templateModel.put("daysRemaining", daysRemaining);
        templateModel.put("warrantyEndDate", device.getWarrantyEndDate());

        sendHtmlMessage(
                user.getEmail(),
                "Warranty Expiration Reminder: " + device.getName(),
                "warranty-expiration",
                templateModel
        );
    }

    @Async
    public void sendMaintenanceReminder(User user, Device device, MaintenanceRecord maintenance) {
        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("name", user.getName());
        templateModel.put("deviceName", device.getName());
        templateModel.put("maintenanceDate", maintenance.getNextScheduledDate());
        templateModel.put("maintenanceType", maintenance.getType());
        templateModel.put("notes", maintenance.getDescription());

        sendHtmlMessage(
                user.getEmail(),
                "Maintenance Reminder: " + device.getName(),
                "maintenance-reminder",
                templateModel
        );
    }

    @Async
    public void sendMonthlySummary(User user, List<Device> expiringDevices) {
        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("name", user.getName());
        templateModel.put("devices", expiringDevices);

        sendHtmlMessage(
                user.getEmail(),
                "Your Monthly Warranty Summary",
                "monthly-summary",
                templateModel
        );
    }

    private void sendHtmlMessage(String to, String subject, String templateName, Map<String, Object> templateModel) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Context context = new Context();
            context.setVariables(templateModel);

            String htmlContent = templateEngine.process(templateName, context);

            helper.setFrom(fromEmail, senderName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException | UnsupportedEncodingException e) {
            // Log error but don't throw - email failures should not block business logic
        }
    }
}