package com.eventmanagement.dto;

import com.eventmanagement.model.RegistrationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegistrationUpdateRequest {
    @NotNull
    private RegistrationStatus status;
    private String notes;
} 