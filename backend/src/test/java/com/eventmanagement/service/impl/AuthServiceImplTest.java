package com.eventmanagement.service.impl;

import com.eventmanagement.dto.AuthRequest;
import com.eventmanagement.dto.JwtResponse;
import com.eventmanagement.dto.RegisterRequest;
import com.eventmanagement.exception.AuthException;
import com.eventmanagement.model.User;
import com.eventmanagement.model.UserRole;
import com.eventmanagement.repository.UserRepository;
import com.eventmanagement.security.JwtUtil;
import com.eventmanagement.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AuthServiceImplTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private EmailService emailService;
    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void register_duplicateEmail_throwsException() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("test@example.com");
        when(userRepository.existsByEmail(anyString())).thenReturn(true);
        assertThrows(AuthException.class, () -> authService.register(req));
    }

    @Test
    void login_success_returnsJwtResponse() {
        AuthRequest req = new AuthRequest();
        req.setEmail("user@example.com");
        req.setPassword("password");
        User user = User.builder()
                .email("user@example.com")
                .password("hashed")
                .role(UserRole.ATTENDEE)
                .isActive(true)
                .build();
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mock(Authentication.class));
        when(jwtUtil.generateToken(anyString(), eq(false))).thenReturn("access-token");
        when(jwtUtil.generateToken(anyString(), eq(true))).thenReturn("refresh-token");
        JwtResponse resp = authService.login(req);
        assertNotNull(resp);
        assertEquals("access-token", resp.getAccessToken());
        assertEquals("refresh-token", resp.getRefreshToken());
    }
} 