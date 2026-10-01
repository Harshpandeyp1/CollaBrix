package com.example.collabrix.backend.Events;

import com.example.collabrix.backend.Entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ConnectionAcceptedEvent {

    private final UserEntity recipient;
    private final UserEntity actor;
}
