package com.example.collabrix.backend.Dto.Notification;

import com.example.collabrix.backend.Enum.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class NotificationResponseDto {

    private Long id;

    private NotificationType type;

    private String message;

    private Long referenceId;

    private boolean read;

    private LocalDateTime createdAt;
}