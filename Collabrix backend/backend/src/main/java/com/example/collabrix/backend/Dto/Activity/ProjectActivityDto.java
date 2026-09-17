package com.example.collabrix.backend.Dto.Activity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

    @Getter
    @Builder
    @AllArgsConstructor
    public class ProjectActivityDto {

        private Long id;

        private Long userId;

        private String username;

        private String profileImage;

        private String action;

        private String description;

        private LocalDateTime createdAt;

}
