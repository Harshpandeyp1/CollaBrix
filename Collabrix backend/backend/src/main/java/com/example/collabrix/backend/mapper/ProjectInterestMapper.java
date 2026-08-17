package com.example.collabrix.backend.mapper;

import com.example.collabrix.backend.Dto.Project.ProjectInterestDto;
import com.example.collabrix.backend.Entity.ProjectInterest;
import com.example.collabrix.backend.Entity.UserEntity;
import org.springframework.stereotype.Component;

@Component
public class ProjectInterestMapper {

    public ProjectInterestDto toDto(ProjectInterest interest) {

        if (interest == null) {
            return null;
        }

        UserEntity user = interest.getUser();

        return ProjectInterestDto.builder()
                .id(interest.getId())
                .projectId(interest.getProject().getId())
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .profileImage(user.getProfileImage())
                .status(interest.getStatus())
                .createdAt(interest.getCreatedAt())
                .build();
    }
}