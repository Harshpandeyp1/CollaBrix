package com.example.collabrix.backend.Dto.Search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class SearchProjectDto {

    private Long id;
    private String title;
    private String description;
    private String techStack;
    private String image;

    private Long ownerId;
    private String ownerUsername;
}