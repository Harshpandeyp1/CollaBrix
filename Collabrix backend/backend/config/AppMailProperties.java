package com.example.collabrix.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

// Binds "app.mail.from" in application.properties to the "from" field.
// Named AppMailProperties, not MailProperties, because Spring Boot already has a class
// called MailProperties (for spring.mail.*) and two classes with the same name confuse
// both you and the IDE.
@ConfigurationProperties(prefix = "app.mail")
public record AppMailProperties(
        @DefaultValue("no-reply@collabrix.local") String from
) {}