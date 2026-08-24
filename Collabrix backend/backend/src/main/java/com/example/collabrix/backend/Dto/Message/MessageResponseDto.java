package com.example.collabrix.backend.Dto.Message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class MessageResponseDto {

    private Long id;

    private Long senderId;
    private String senderUsername;
    private String senderProfileImage;

    private Long receiverId;
    private String receiverUsername;
    private String receiverProfileImage;

    private String content;

    private LocalDateTime createdAt;
}