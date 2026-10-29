package com.example.collabrix.backend.Dto.Message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class ConversationresponseDto {
    private Long userId;

    private String username;

    private String profileImage;

    private String lastMessage;

    private LocalDateTime lastMessageAt;
}
