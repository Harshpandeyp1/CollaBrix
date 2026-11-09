package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.Activity.ProjectActivityDto;
import com.example.collabrix.backend.Entity.Project;
import com.example.collabrix.backend.Entity.ProjectInterest;
import com.example.collabrix.backend.Entity.ProjectActivityEntity;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Enum.InterestStatus;
import com.example.collabrix.backend.Repository.ProjectActivityRepository;
import com.example.collabrix.backend.Repository.ProjectInterestRepo;
import com.example.collabrix.backend.Repository.ProjectRepo;
import com.example.collabrix.backend.Repository.UserRepo;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectActivityService {

    private final ProjectActivityRepository activityRepository;
    private final ProjectRepo projectRepo;
    private final ProjectInterestRepo projectInterestRepo;
    private final UserRepo userRepo;


    public List<ProjectActivityDto> getActivities(Long projectId) {

        UserEntity currentUser = getCurrentUser();

        Project project =
                projectRepo.findById(projectId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Project not found"
                                ));

        verifyProjectAccess(project, currentUser);

        return activityRepository
                .findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream()
                .map(this::toDto)
                .toList();
    }


    private void verifyProjectAccess(
            Project project,
            UserEntity currentUser) {

        // Project owner
        if (project.getUser().getId()
                ==(currentUser.getId())) {

            return;
        }

        // Accepted project member
        projectInterestRepo
                .findByProjectIdAndUserId(
                        project.getId(),
                        currentUser.getId()
                )
                .filter(interest ->
                        interest.getStatus()
                                == InterestStatus.ACCEPTED
                )
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.FORBIDDEN,
                                "You are not a member of this project"
                        ));
    }


    private UserEntity getCurrentUser() {

        var authentication =
                org.springframework.security.core.context
                        .SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return userRepo
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));
    }


    private ProjectActivityDto toDto(
            ProjectActivityEntity activity) {

        UserEntity user = activity.getUser();

        return ProjectActivityDto.builder()
                .id(activity.getId())
                .userId(user.getId())
                .username(user.getUsername())
                .profileImage(user.getProfileImage())
                .action(activity.getAction())
                .description(activity.getDescription())
                .createdAt(activity.getCreatedAt())
                .build();
    }
}