package com.eventmanagement.controller;

import com.eventmanagement.dto.*;
import com.eventmanagement.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;

    @PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
    @PostMapping
    public ResponseEntity<EventResponse> createEvent(@RequestAttribute("userId") String organizerId,
                                                    @Valid @RequestBody EventCreateRequest request) {
        return ResponseEntity.ok(eventService.createEvent(organizerId, request));
    }

    @GetMapping
    public ResponseEntity<Page<EventResponse>> listEvents(Pageable pageable) {
        return ResponseEntity.ok(eventService.listEvents(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable String id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PreAuthorize("@eventSecurity.isOwnerOrAdmin(#id, authentication)")
    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(@PathVariable String id,
                                                    @RequestAttribute("userId") String userId,
                                                    @Valid @RequestBody EventUpdateRequest request) {
        return ResponseEntity.ok(eventService.updateEvent(id, userId, request));
    }

    @PreAuthorize("@eventSecurity.isOwnerOrAdmin(#id, authentication)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String id,
                                            @RequestAttribute("userId") String userId) {
        try {
            eventService.deleteEvent(id, userId);
            return ResponseEntity.ok().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Page<EventResponse>> searchEvents(@RequestParam String query, Pageable pageable) {
        return ResponseEntity.ok(eventService.searchEvents(query, pageable));
    }

    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<Page<EventResponse>> listEventsByOrganizer(@PathVariable String organizerId, Pageable pageable) {
        return ResponseEntity.ok(eventService.listEventsByOrganizer(organizerId, pageable));
    }

    @PreAuthorize("@eventSecurity.isOwnerOrAdmin(#id, authentication)")
    @PutMapping("/{id}/status")
    public ResponseEntity<EventResponse> updateEventStatus(@PathVariable String id,
                                                          @RequestAttribute("userId") String userId,
                                                          @RequestParam String status) {
        return ResponseEntity.ok(eventService.updateEventStatus(id, userId, status));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> listCategories() {
        return ResponseEntity.ok(eventService.listCategories());
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/verify-database")
    public ResponseEntity<String> verifyDatabase() {
        try {
            ((com.eventmanagement.service.impl.EventServiceImpl) eventService).verifyDatabaseConnectivity();
            return ResponseEntity.ok("Database connectivity verified successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Database verification failed: " + e.getMessage());
        }
    }
} 