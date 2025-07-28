package com.eventmanagement.dto;

import com.eventmanagement.model.EventCategory;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class UserUpdateRequest {
    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    private String phone;

    private String profileImage;
    private List<EventCategory> preferences;
    private Boolean notifications;
} 