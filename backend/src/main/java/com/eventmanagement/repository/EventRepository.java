package com.eventmanagement.repository;

import com.eventmanagement.model.Event;
import com.eventmanagement.model.EventCategory;
import com.eventmanagement.model.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface EventRepository extends MongoRepository<Event, String> {
    List<Event> findByOrganizerId(String organizerId);
    List<Event> findByCategory(EventCategory category);
    
    // Methods to exclude cancelled events
    Page<Event> findByStatusNot(EventStatus status, Pageable pageable);
    List<Event> findByOrganizerIdAndStatusNot(String organizerId, EventStatus status);
    List<Event> findByStatusIn(List<EventStatus> statuses);
} 