package com.eventmanagement.controller;

import com.eventmanagement.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final RegistrationService registrationService;

    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/organizer")
    public ResponseEntity<?> getOrganizerStats(@RequestAttribute("userId") String userId) {
        return ResponseEntity.ok(new java.util.HashMap<>());
    }

    @PreAuthorize("hasRole('ATTENDEE')")
    @GetMapping("/attendee")
    public ResponseEntity<?> getAttendeeStats(@RequestAttribute("userId") String userId) {
        var activeRegistrationsWithEvent = registrationService.getActiveRegistrationsWithEventByUser(userId);
        System.out.println("Dashboard - User: " + userId + ", Active registrations count: " + activeRegistrationsWithEvent.size());
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("registrations", activeRegistrationsWithEvent);
        response.put("count", activeRegistrationsWithEvent.size());
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<?> getAdminStats() {
        return ResponseEntity.ok(new java.util.HashMap<>());
    }
} 