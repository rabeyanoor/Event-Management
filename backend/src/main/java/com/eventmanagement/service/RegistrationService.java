package com.eventmanagement.service;

import com.eventmanagement.dto.*;
import java.util.List;

public interface RegistrationService {
    RegistrationResponse register(String userId, RegistrationCreateRequest request);
    RegistrationResponse updateRegistration(String registrationId, RegistrationUpdateRequest request);
    void cancelRegistration(String registrationId, String userId);
    RegistrationResponse markAttendance(String registrationId, boolean attended);
    List<RegistrationResponse> getRegistrationsByUser(String userId);
    List<RegistrationResponse> getRegistrationsByEvent(String eventId);
    List<com.eventmanagement.dto.EventResponse> getRegisteredEventsForUser(String userId);
    List<RegistrationResponse> getConfirmedRegistrationsByUser(String userId);
    List<ConfirmedRegistrationWithEventResponse> getConfirmedRegistrationsWithEventByUser(String userId);
    List<ConfirmedRegistrationWithEventResponse> getActiveRegistrationsWithEventByUser(String userId);
} 