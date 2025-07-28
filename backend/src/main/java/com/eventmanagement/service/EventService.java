package com.eventmanagement.service;

import com.eventmanagement.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface EventService {
    EventResponse createEvent(String organizerId, EventCreateRequest request);
    EventResponse updateEvent(String eventId, String userId, EventUpdateRequest request);
    void deleteEvent(String eventId, String userId);
    EventResponse getEventById(String eventId);
    Page<EventResponse> listEvents(Pageable pageable);
    Page<EventResponse> searchEvents(String query, Pageable pageable);
    Page<EventResponse> listEventsByOrganizer(String organizerId, Pageable pageable);
    EventResponse updateEventStatus(String eventId, String userId, String status);
    List<String> listCategories();
} 