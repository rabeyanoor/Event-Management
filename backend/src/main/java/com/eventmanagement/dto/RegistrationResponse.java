package com.eventmanagement.dto;

import com.eventmanagement.model.RegistrationStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RegistrationResponse {
    private String id;
    private String eventId;
    private String userId;
    private RegistrationStatus status;
    private LocalDateTime registrationDate;
    private String notes;
    private boolean attended;
} 