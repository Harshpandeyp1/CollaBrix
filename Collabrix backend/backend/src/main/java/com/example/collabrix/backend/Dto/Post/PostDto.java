package com.example.collabrix.backend.Dto.Post;


import com.example.collabrix.backend.Dto.Project.ProjectDto;
import com.example.collabrix.backend.Entity.Post;
import com.example.collabrix.backend.Enum.PostStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PostDto {

    private Long id;

    private String title;

    private String description;

    private List<String> techStack;

    private List<String> rolesNeeded;

    private PostStatus status;

    private Integer teamSizeNeeded;

    private String duration;

    private String githubUrl;

    private String demoUrl;

    private String bannerImage;

    private List<String> tags;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Owner Information
    private Long userId;

    private String username;

    private String fullName;

    private String profileImage;

    private Long projectId;

    private ProjectDto project;
}