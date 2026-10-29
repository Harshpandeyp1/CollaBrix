package com.example.collabrix.backend.Dto.ProjectFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class ProjectFileDto {

    private Long id;

    private String fileName;

    private String fileUrl;

    private String fileType;

    private Long fileSize;

    private Long uploadedById;

    private String uploadedByUsername;

    private String uploadedByProfileImage;

    private LocalDateTime createdAt;
}