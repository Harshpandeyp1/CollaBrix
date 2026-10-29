package com.example.collabrix.backend.Dto.Project;

import com.example.collabrix.backend.Enum.ProjectStatus;
import lombok.Data;

@Data
public class ProjectDto {

    private Long id;

    private String title;

    private String description;

    private String techStack;

    private String githubUrl;

    private String liveUrl;

    private String image;

    private ProjectStatus status;

    private boolean lookingForCollaborators;

    private Long userId;
}