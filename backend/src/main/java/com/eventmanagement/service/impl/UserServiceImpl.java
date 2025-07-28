package com.eventmanagement.service.impl;

import com.eventmanagement.dto.UserProfileResponse;
import com.eventmanagement.dto.UserUpdateRequest;
import com.eventmanagement.exception.AuthException;
import com.eventmanagement.model.User;
import com.eventmanagement.repository.UserRepository;
import com.eventmanagement.service.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserProfileResponse getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found"));
        return toProfileResponse(user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(String userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found"));
        
        // Store original values for logging
        String originalFirstName = user.getFirstName();
        String originalLastName = user.getLastName();
        String originalPhone = user.getPhone();
        
        System.out.println("Updating profile for user " + userId + ": " + originalFirstName + " " + originalLastName + " -> " + request.getFirstName() + " " + request.getLastName());
        
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setProfileImage(request.getProfileImage());
        
        if (request.getPreferences() != null) {
            if (user.getPreferences() == null) {
                user.setPreferences(new User.UserPreferences());
            }
            user.getPreferences().setCategories(request.getPreferences());
        }
        
        if (request.getNotifications() != null) {
            if (user.getPreferences() == null) {
                user.setPreferences(new User.UserPreferences());
            }
            user.getPreferences().setNotifications(request.getNotifications());
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        
        try {
            User savedUser = userRepository.save(user);
            System.out.println("Successfully updated profile for user " + userId + " in database. Name: " + savedUser.getFirstName() + " " + savedUser.getLastName() + ", Phone: " + savedUser.getPhone());
            return toProfileResponse(savedUser);
        } catch (Exception e) {
            System.err.println("Failed to update profile for user " + userId + " in database: " + e.getMessage());
            throw new RuntimeException("Failed to update profile in database", e);
        }
    }

    @Override
    public UserProfileResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AuthException("User not found"));
        return toProfileResponse(user);
    }

    @Override
    public void deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AuthException("User not found"));
        user.setActive(false); // Soft delete
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    public Page<UserProfileResponse> listUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::toProfileResponse);
    }

    private UserProfileResponse toProfileResponse(User user) {
        UserProfileResponse resp = new UserProfileResponse();
        BeanUtils.copyProperties(user, resp);
        if (user.getPreferences() != null) {
            resp.setPreferences(user.getPreferences().getCategories());
            resp.setNotifications(user.getPreferences().isNotifications());
        }
        return resp;
    }
} 