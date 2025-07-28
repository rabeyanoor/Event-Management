package com.eventmanagement.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "events")
public class Event {
    @Id
    private String id;
    private String title;
    private String description;
    private EventCategory category;
    private String organizerId;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private Location location;
    private int capacity;
    private LocalDateTime registrationDeadline;
    private EventStatus status;
    private List<String> tags;
    private String imageUrl;
    private String requirements;
    private String agenda;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Location {
        private LocationType type;
        private String address;
        private String city;
        private String country;
        private String virtualLink;
    }
} 