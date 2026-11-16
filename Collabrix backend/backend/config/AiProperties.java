package com.example.collabrix.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
@ConfigurationProperties(prefix = "app.ai")
public record AiProperties(
        @DefaultValue("10") int maxCallsPerMinute,
        @DefaultValue("150") int maxTitleLength,
        @DefaultValue("2000") int maxDescriptionLength
) {}