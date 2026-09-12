package com.example.collabrix.backend.Dto.Playground;

import com.example.collabrix.backend.Enum.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class PlaygroundDetailDto {

    private Long projectId;
    private String projectTitle;
    private String description;
    private String techStack;
    private String githubUrl;
    private String image;
    private int teamSize;
    private ProjectStatus status;
    private String ownerUsername;
}