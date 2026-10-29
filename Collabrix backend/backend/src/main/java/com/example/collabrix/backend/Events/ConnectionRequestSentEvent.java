package com.example.collabrix.backend.Events;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ConnectionRequestSentEvent {

    private final Long recipientUserId;

    private final Long actorUserId;
}