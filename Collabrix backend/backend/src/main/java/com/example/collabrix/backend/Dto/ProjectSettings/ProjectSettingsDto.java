   package com.example.collabrix.backend.Dto.ProjectSettings;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ProjectSettingsDto {

    private Long projectId;

    private String title;

    private String description;

    private String techStack;

    private String githubUrl;

    private String liveUrl;

    private String image;

    private String projectRole;

    private int teamSize;

    private String lookingFor;

    private boolean lookingForCollaborators;
}

