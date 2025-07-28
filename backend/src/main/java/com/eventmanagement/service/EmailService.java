package com.eventmanagement.service;

public interface EmailService {
    void sendVerificationEmail(String to, String verificationLink);
    void sendPasswordResetEmail(String to, String resetLink);
} 