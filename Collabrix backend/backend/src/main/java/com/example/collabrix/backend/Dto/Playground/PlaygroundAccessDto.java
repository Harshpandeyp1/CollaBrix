package com.example.collabrix.backend.Dto.Playground;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class PlaygroundAccessDto {

    private Long projectId;
    private String projectTitle;
    private String ownerUsername;
}