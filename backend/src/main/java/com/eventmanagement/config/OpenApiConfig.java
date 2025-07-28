package com.eventmanagement.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Font End Event Management API",
        version = "1.0",
        description = "Backend API for Font End Event Management System",
        contact = @Contact(name = "Font End Team", email = "support@fontend.com")
    )
)
public class OpenApiConfig {} 