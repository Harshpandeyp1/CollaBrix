package com.example.collabrix.backend.Events;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProjectInterestCreatedEvent {

    private final Long recipientUserId;

    private final Long actorUserId;

    private final Long projectId;

    private final String message;
}