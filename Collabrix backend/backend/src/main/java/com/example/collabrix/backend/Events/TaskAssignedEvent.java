package com.example.collabrix.backend.Events;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TaskAssignedEvent {

    private final Long recipientUserId;
    private final Long actorUserId;
    private final Long taskId;
    private final String message;
}