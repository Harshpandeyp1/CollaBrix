package com.example.collabrix.backend.Dto.Message;

import com.example.collabrix.backend.Enum.ShareItemType;
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

    private ShareItemType sharedItemType;
    private Long sharedItemId;
    private String sharedItemTitle;
    private String sharedMessage;

    private LocalDateTime createdAt;
}
