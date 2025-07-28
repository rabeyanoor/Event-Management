package com.eventmanagement.controller;

import com.eventmanagement.dto.*;
import com.eventmanagement.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {
    private final RegistrationService registrationService;

    @PostMapping
    public ResponseEntity<RegistrationResponse> register(@RequestAttribute("userId") String userId,
                                                        @Valid @RequestBody RegistrationCreateRequest request) {
        return ResponseEntity.ok(registrationService.register(userId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RegistrationResponse> updateRegistration(@PathVariable String id,
                                                                  @Valid @RequestBody RegistrationUpdateRequest request) {
        return ResponseEntity.ok(registrationService.updateRegistration(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelRegistration(@PathVariable String id,
                                                   @RequestAttribute("userId") String userId) {
        registrationService.cancelRegistration(id, userId);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
    @PutMapping("/{id}/attendance")
    public ResponseEntity<RegistrationResponse> markAttendance(@PathVariable String id,
                                                              @RequestParam boolean attended) {
        return ResponseEntity.ok(registrationService.markAttendance(id, attended));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RegistrationResponse>> getRegistrationsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(registrationService.getRegistrationsByUser(userId));
    }

    @PreAuthorize("hasAnyRole('ORGANIZER','ADMIN','ATTENDEE')")
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<RegistrationResponse>> getRegistrationsByEvent(@PathVariable String eventId) {
        return ResponseEntity.ok(registrationService.getRegistrationsByEvent(eventId));
    }
} 