package com.eventmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegistrationCreateRequest {
    @NotBlank
    private String eventId;
    private String notes;
} 