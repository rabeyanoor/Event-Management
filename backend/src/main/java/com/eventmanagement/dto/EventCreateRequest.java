package com.eventmanagement.dto;

import com.eventmanagement.model.EventCategory;
import com.eventmanagement.model.LocationType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class EventCreateRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private EventCategory category;

    @NotNull
    @Future
    private LocalDateTime startDateTime;

    @NotNull
    @Future
    private LocalDateTime endDateTime;

    @NotNull
    private LocationType locationType;

    private String address;
    private String city;
    private String country;
    private String virtualLink;

    @Min(1)
    private int capacity;

    @NotNull
    @Future
    private LocalDateTime registrationDeadline;

    private List<String> tags;
    private String imageUrl;
    private String requirements;
    private String agenda;
} 