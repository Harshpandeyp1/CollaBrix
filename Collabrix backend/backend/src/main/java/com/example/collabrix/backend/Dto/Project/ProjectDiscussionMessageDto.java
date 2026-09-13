package com.example.collabrix.backend.Dto.Project;

import lombok.AllArgsConstructor;


import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

    @Getter
    @Builder
    @AllArgsConstructor
    public class ProjectDiscussionMessageDto {

        private Long id;

        private Long senderId;

        private String senderUsername;

        private String senderProfileImage;

        private String content;

        private LocalDateTime createdAt;
    }

