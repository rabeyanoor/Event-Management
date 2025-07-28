package com.eventmanagement.security;

import com.eventmanagement.model.Event;
import com.eventmanagement.model.UserRole;
import com.eventmanagement.repository.EventRepository;
import com.eventmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

@Component("eventSecurity")
@RequiredArgsConstructor
public class EventSecurity {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public boolean isOwnerOrAdmin(String eventId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        String email = authentication.getName();
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return false;
        var user = userOpt.get();
        
        System.out.println("[EventSecurity] User: " + user.getEmail() + ", Role: " + user.getRole() + ", Authorities: " + authentication.getAuthorities());
       
        // Allow ADMIN and ORGANIZER roles to edit/delete any event
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if (authority.getAuthority().equals("ROLE_ADMIN") || 
                authority.getAuthority().equals("ROLE_ORGANIZER")) {
                return true;
            }
        }
        
        // Also allow the original event owner
        Event event = eventRepository.findById(eventId).orElse(null);
        return event != null && event.getOrganizerId().equals(user.getId());
    }
} 