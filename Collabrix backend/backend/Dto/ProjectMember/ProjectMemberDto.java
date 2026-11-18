package com.example.collabrix.backend.Dto.ProjectMember;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ProjectMemberDto {

    private Long userId;

    private String username;

    private String fullName;

    private String headline;

    private String profileImage;

    private String role;
}