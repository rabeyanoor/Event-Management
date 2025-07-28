package com.eventmanagement.dto;

import com.eventmanagement.model.EventCategory;
import com.eventmanagement.model.UserRole;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserProfileResponse {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private UserRole role;
    private String profileImage;
    private List<EventCategory> preferences;
    private boolean notifications;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isActive;
} 