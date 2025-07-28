package com.eventmanagement.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "registrations")
public class Registration {
    @Id
    private String id;
    private String eventId;
    private String userId;
    private RegistrationStatus status;
    private LocalDateTime registrationDate;
    private String notes;
    private boolean attended;
} 