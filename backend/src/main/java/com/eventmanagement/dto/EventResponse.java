package com.eventmanagement.dto;

import com.eventmanagement.model.EventCategory;
import com.eventmanagement.model.EventStatus;
import com.eventmanagement.model.LocationType;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class EventResponse {
    private String id;
    private String title;
    private String description;
    private EventCategory category;
    private String organizerId;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private LocationType locationType;
    private String address;
    private String city;
    private String country;
    private String virtualLink;
    private int capacity;
    private LocalDateTime registrationDeadline;
    private EventStatus status;
    private List<String> tags;
    private String imageUrl;
    private String requirements;
    private String agenda;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int registeredCount;
} 