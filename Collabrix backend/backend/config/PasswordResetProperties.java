package com.example.collabrix.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

// Binds app.password-reset.* (your @ConfigurationPropertiesScan from the AI work
// finds it automatically). The kebab-case keys map to these camelCase fields.
@ConfigurationProperties(prefix = "app.password-reset")
public record PasswordResetProperties(
        @DefaultValue("30") long tokenTtlMinutes,
        @DefaultValue("http://localhost:5173") String frontendUrl
) {}