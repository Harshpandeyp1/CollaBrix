package com.example.collabrix.backend.Dto.Share;

import com.example.collabrix.backend.Enum.ShareItemType;

import java.time.LocalDateTime;

public record ShareDto(
        Long id,
        Long senderId,
        String senderUsername,
        ShareItemType itemType,
        Long itemId,
        String itemTitle,
        String message,
        LocalDateTime createdAt,
        boolean seen
) {}
