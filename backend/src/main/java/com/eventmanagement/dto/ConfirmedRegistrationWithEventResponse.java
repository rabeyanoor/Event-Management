package com.eventmanagement.dto;

import lombok.Data;

@Data
public class ConfirmedRegistrationWithEventResponse {
    private RegistrationResponse registration;
    private EventResponse event;
} 