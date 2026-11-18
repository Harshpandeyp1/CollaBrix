package com.example.collabrix.backend.Dto.Share;

import com.example.collabrix.backend.Enum.ShareItemType;

import java.util.List;

public record CreateShareDto(
        ShareItemType itemType,
        Long itemId,
        List<Long> recipientIds,
        String message)
{}
