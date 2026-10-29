
        package com.example.collabrix.backend.Dto.ProjectSettings;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProjectSettingsDto {

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
