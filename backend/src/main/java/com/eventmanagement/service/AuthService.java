package com.eventmanagement.service;

import com.eventmanagement.dto.*;

public interface AuthService {
    void register(RegisterRequest request);
    JwtResponse login(AuthRequest request);
    JwtResponse refresh(String refreshToken);
    void logout(String accessToken);
    void forgotPassword(String email);
    void resetPassword(String token, String newPassword);
} 