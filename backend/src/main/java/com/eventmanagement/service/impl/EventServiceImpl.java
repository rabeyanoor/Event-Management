package com.eventmanagement.service.impl;

import com.eventmanagement.dto.*;
import com.eventmanagement.model.*;
import com.eventmanagement.repository.EventRepository;
import com.eventmanagement.repository.RegistrationRepository;
import com.eventmanagement.service.EventService;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventServiceImpl implements EventService {
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    public EventServiceImpl(EventRepository eventRepository, RegistrationRepository registrationRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
    }

    @Override
    @Transactional
    public EventResponse createEvent(String organizerId, EventCreateRequest request) {
        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .organizerId(organizerId)
                .startDateTime(request.getStartDateTime())
                .endDateTime(request.getEndDateTime())
                .location(Event.Location.builder()
                        .type(request.getLocationType())
                        .address(request.getAddress())
                        .city(request.getCity())
                        .country(request.getCountry())
                        .virtualLink(request.getVirtualLink())
                        .build())
                .capacity(request.getCapacity())
                .registrationDeadline(request.getRegistrationDeadline())
                .status(EventStatus.PUBLISHED)
                .tags(request.getTags())
                .imageUrl(request.getImageUrl())
                .requirements(request.getRequirements())
                .agenda(request.getAgenda())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        try {
            Event savedEvent = eventRepository.save(event);
            System.out.println("Successfully created event '" + savedEvent.getTitle() + "' with ID " + savedEvent.getId() + " in database");
            return toEventResponse(savedEvent);
        } catch (Exception e) {
            System.err.println("Failed to create event '" + request.getTitle() + "' in database: " + e.getMessage());
            throw new RuntimeException("Failed to create event in database", e);
        }
    }

    @Override
    @Transactional
    public EventResponse updateEvent(String eventId, String userId, EventUpdateRequest request) {
        System.out.println("Updating event " + eventId + " with request: " + request);
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        // Store original values for logging
        String originalTitle = event.getTitle();
        EventStatus originalStatus = event.getStatus();
        
        // Authorization is handled by @PreAuthorize in the controller
        // No need to check here as the security layer already validated permissions
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory());
        event.setStartDateTime(request.getStartDateTime());
        event.setEndDateTime(request.getEndDateTime());
        event.setLocation(Event.Location.builder()
                .type(request.getLocationType())
                .address(request.getAddress())
                .city(request.getCity())
                .country(request.getCountry())
                .virtualLink(request.getVirtualLink())
                .build());
        event.setCapacity(request.getCapacity());
        event.setRegistrationDeadline(request.getRegistrationDeadline());
        event.setTags(request.getTags());
        event.setImageUrl(request.getImageUrl());
        event.setRequirements(request.getRequirements());
        event.setAgenda(request.getAgenda());
        event.setUpdatedAt(LocalDateTime.now());
        
        try {
            Event savedEvent = eventRepository.save(event);
            System.out.println("Successfully updated event " + eventId + " in database. Title changed from '" + originalTitle + "' to '" + savedEvent.getTitle() + "'");
            verifyEventInDatabase(eventId, "update");
            return toEventResponse(savedEvent);
        } catch (Exception e) {
            System.err.println("Failed to update event " + eventId + " in database: " + e.getMessage());
            throw new RuntimeException("Failed to update event in database", e);
        }
    }

    @Override
    @Transactional
    public void deleteEvent(String eventId, String userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        String eventTitle = event.getTitle();
        EventStatus originalStatus = event.getStatus();
        
        // Authorization is handled by @PreAuthorize in the controller
        // No need to check here as the security layer already validated permissions
        
        try {
            // Cancel all registrations for this event
            List<Registration> registrations = registrationRepository.findByEventId(eventId);
            System.out.println("Cancelling " + registrations.size() + " registrations for event " + eventId + " ('" + eventTitle + "')");
            
            int cancelledCount = 0;
            for (Registration registration : registrations) {
                if (registration.getStatus() != RegistrationStatus.CANCELLED) {
                    System.out.println("Cancelling registration " + registration.getId() + " for user " + registration.getUserId());
                    registration.setStatus(RegistrationStatus.CANCELLED);
                    registrationRepository.save(registration);
                    cancelledCount++;
                }
            }
            
            // Soft delete: set status to CANCELLED
            event.setStatus(EventStatus.CANCELLED);
            event.setUpdatedAt(LocalDateTime.now());
            Event savedEvent = eventRepository.save(event);
            
            System.out.println("Successfully deleted event " + eventId + " ('" + eventTitle + "') from database. Status changed from " + originalStatus + " to " + savedEvent.getStatus() + ". Cancelled " + cancelledCount + " registrations.");
            verifyEventInDatabase(eventId, "delete");
            
        } catch (Exception e) {
            System.err.println("Failed to delete event " + eventId + " from database: " + e.getMessage());
            throw new RuntimeException("Failed to delete event from database", e);
        }
    }

    @Override
    public EventResponse getEventById(String eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        // Check if event is cancelled
        if (event.getStatus() == EventStatus.CANCELLED) {
            throw new RuntimeException("Event has been cancelled");
        }
        
        return toEventResponse(event);
    }

    @Override
    public Page<EventResponse> listEvents(Pageable pageable) {
        // Only return events that are not cancelled
        return eventRepository.findByStatusNot(EventStatus.CANCELLED, pageable).map(this::toEventResponse);
    }

    @Override
    public Page<EventResponse> searchEvents(String query, Pageable pageable) {
        // TODO: Implement full-text search using MongoDB text indexes
        return Page.empty();
    }

    @Override
    public Page<EventResponse> listEventsByOrganizer(String organizerId, Pageable pageable) {
        // Only return events that are not cancelled
        List<Event> events = eventRepository.findByOrganizerIdAndStatusNot(organizerId, EventStatus.CANCELLED);
        List<EventResponse> responses = events.stream().map(this::toEventResponse).collect(Collectors.toList());
        // Manual pagination for now
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), responses.size());
        return new org.springframework.data.domain.PageImpl<>(responses.subList(start, end), pageable, responses.size());
    }

    @Override
    public EventResponse updateEventStatus(String eventId, String userId, String status) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        // Authorization is handled by @PreAuthorize in the controller
        // No need to check here as the security layer already validated permissions
        EventStatus newStatus = EventStatus.valueOf(status);
        // Enforce valid status transitions if needed
        event.setStatus(newStatus);
        event.setUpdatedAt(LocalDateTime.now());
        eventRepository.save(event);
        return toEventResponse(event);
    }

    @Override
    public List<String> listCategories() {
        return Arrays.stream(EventCategory.values()).map(Enum::name).collect(Collectors.toList());
    }
    
    // Method to verify database connectivity and operations
    public void verifyDatabaseConnectivity() {
        try {
            long totalEvents = eventRepository.count();
            long publishedEvents = eventRepository.findByStatusNot(EventStatus.CANCELLED, org.springframework.data.domain.Pageable.unpaged()).getTotalElements();
            long cancelledEvents = totalEvents - publishedEvents;
            
            System.out.println("Database connectivity verified. Total events: " + totalEvents + ", Published: " + publishedEvents + ", Cancelled: " + cancelledEvents);
        } catch (Exception e) {
            System.err.println("Database connectivity check failed: " + e.getMessage());
            throw new RuntimeException("Database connectivity issue", e);
        }
    }

    private EventResponse toEventResponse(Event event) {
        EventResponse resp = new EventResponse();
        BeanUtils.copyProperties(event, resp);
        if (event.getLocation() != null) {
            resp.setLocationType(event.getLocation().getType());
            resp.setAddress(event.getLocation().getAddress());
            resp.setCity(event.getLocation().getCity());
            resp.setCountry(event.getLocation().getCountry());
            resp.setVirtualLink(event.getLocation().getVirtualLink());
        }
        int registeredCount = (int) registrationRepository.countByEventIdAndStatus(event.getId(), RegistrationStatus.CONFIRMED);
        resp.setRegisteredCount(registeredCount);
        return resp;
    }
    
    // Helper method to verify database state after operations
    private void verifyEventInDatabase(String eventId, String operation) {
        try {
            Optional<Event> eventOpt = eventRepository.findById(eventId);
            if (eventOpt.isPresent()) {
                Event event = eventOpt.get();
                System.out.println("Database verification after " + operation + " - Event " + eventId + ": title='" + event.getTitle() + "', status=" + event.getStatus() + ", updatedAt=" + event.getUpdatedAt());
            } else {
                System.out.println("Database verification after " + operation + " - Event " + eventId + " not found in database");
            }
        } catch (Exception e) {
            System.err.println("Failed to verify event " + eventId + " in database: " + e.getMessage());
        }
    }
} 