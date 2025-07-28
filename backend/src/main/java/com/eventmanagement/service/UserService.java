package com.eventmanagement.service;

import com.eventmanagement.dto.UserProfileResponse;
import com.eventmanagement.dto.UserUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserProfileResponse getProfile(String userId);
    UserProfileResponse updateProfile(String userId, UserUpdateRequest request);
    UserProfileResponse getUserById(String id);
    void deleteUser(String id);
    Page<UserProfileResponse> listUsers(Pageable pageable);
} 