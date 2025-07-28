package com.eventmanagement.service.impl;

import com.eventmanagement.dto.*;
import com.eventmanagement.exception.AuthException;
import com.eventmanagement.model.User;
import com.eventmanagement.model.UserRole;
import com.eventmanagement.repository.UserRepository;
import com.eventmanagement.security.JwtUtil;
import com.eventmanagement.service.AuthService;
import com.eventmanagement.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;

    @Override
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthException("Email already registered");
        }
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role(request.getRole() != null ? request.getRole() : UserRole.ATTENDEE)
                .isActive(true) // Allow login immediately for testing
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        userRepository.save(user);
        // TODO: Generate verification token and send email
        emailService.sendVerificationEmail(user.getEmail(), "<verification-link>");
    }

    @Override
    public JwtResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthException("Invalid email or password"));
        if (!user.isActive()) {
            throw new AuthException("Account not verified or inactive");
        }
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String accessToken = jwtUtil.generateToken(user.getEmail(), false);
        String refreshToken = jwtUtil.generateToken(user.getEmail(), true);
        return new JwtResponse(accessToken, refreshToken);
    }

    @Override
    public JwtResponse refresh(String refreshToken) {
        try {
            String email = jwtUtil.extractUsername(refreshToken);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new AuthException("Invalid refresh token"));
            if (!user.isActive()) {
                throw new AuthException("Account not verified or inactive");
            }
            if (!jwtUtil.isTokenValid(refreshToken, email)) {
                throw new AuthException("Invalid or expired refresh token");
            }
            String newAccessToken = jwtUtil.generateToken(email, false);
            String newRefreshToken = jwtUtil.generateToken(email, true);
            return new JwtResponse(newAccessToken, newRefreshToken);
        } catch (Exception e) {
            throw new AuthException("Invalid or expired refresh token");
        }
    }

    @Override
    public void logout(String accessToken) {
        // TODO: Implement logout logic (token blacklist or stateless)
    }

    @Override
    public void forgotPassword(String email) {
        // TODO: Implement forgot password logic
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        // TODO: Implement reset password logic
    }

    // --- Email Verification (stub) ---
    // TODO: Implement email verification logic
    // 1. Generate a verification token on registration
    // 2. Store token (DB or cache) and send link via email
    // 3. Create endpoint to verify token, activate user, and delete token

    // --- Password Reset (stub) ---
    // TODO: Implement forgot/reset password logic
    // 1. On forgotPassword, generate a reset token, store it, and email the link
    // 2. On resetPassword, validate token, update password (BCrypt), and delete token
} 