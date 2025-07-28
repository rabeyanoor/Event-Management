package com.eventmanagement.service.impl;

import com.eventmanagement.service.EmailService;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {
    @Override
    public void sendVerificationEmail(String to, String verificationLink) {
        // TODO: Implement email sending logic
    }

    @Override
    public void sendPasswordResetEmail(String to, String resetLink) {
        // TODO: Implement email sending logic
    }
} 