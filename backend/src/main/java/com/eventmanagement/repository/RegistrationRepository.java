package com.eventmanagement.repository;

import com.eventmanagement.model.Registration;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends MongoRepository<Registration, String> {
    List<Registration> findByUserId(String userId);
    List<Registration> findByEventId(String eventId);
    Optional<Registration> findByEventIdAndUserId(String eventId, String userId);
    boolean existsByEventIdAndUserId(String eventId, String userId);
    long countByEventIdAndStatus(String eventId, com.eventmanagement.model.RegistrationStatus status);
} 