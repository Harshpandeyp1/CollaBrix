package com.example.collabrix.backend.Dto.Idea;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class IdeaDto {

    private Long id;

    private String title;

    private String description;

    private Long createdById;

    private String createdByUsername;

    private String createdByProfileImage;

    private LocalDateTime createdAt;
}