package com.example.collabrix.backend.Dto.Project;

import com.example.collabrix.backend.Enum.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateProject {

    @NotBlank
    private String title;

    private String description;

    private String techStack;

    private String githubUrl;

    private String liveUrl;

    private ProjectStatus status;

    private boolean lookingForCollaborators;
}