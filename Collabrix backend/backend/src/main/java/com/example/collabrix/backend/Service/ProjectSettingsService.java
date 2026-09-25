
        package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.ProjectSettings.ProjectSettingsDto;
import com.example.collabrix.backend.Dto.ProjectSettings.UpdateProjectSettingsDto;
import com.example.collabrix.backend.Entity.Project;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Repository.ProjectRepo;
import com.example.collabrix.backend.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ProjectSettingsService {

    private final ProjectRepo projectRepo;
    private final UserRepo userRepo;


    // =====================================================
    // GET PROJECT SETTINGS
    // =====================================================

    public ProjectSettingsDto getProjectSettings(Long projectId) {

        UserEntity currentUser = getCurrentUser();

        Project project =
                projectRepo.findById(projectId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Project not found"
                                ));

        verifyOwner(project, currentUser);

        return toDto(project);
    }


    // =====================================================
    // UPDATE PROJECT SETTINGS
    // =====================================================

    public ProjectSettingsDto updateProjectSettings(
            Long projectId,
            UpdateProjectSettingsDto request) {

        UserEntity currentUser = getCurrentUser();

        Project project =
                projectRepo.findById(projectId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Project not found"
                                ));

        verifyOwner(project, currentUser);


        // Update project fields

        project.setTitle(request.getTitle());

        project.setDescription(request.getDescription());

        project.setTechStack(request.getTechStack());

        project.setGithubUrl(request.getGithubUrl());

        project.setLiveUrl(request.getLiveUrl());

        project.setImage(request.getImage());

        project.setProjectRole(request.getProjectRole());

        project.setTeamSize(request.getTeamSize());

        project.setLookingFor(request.getLookingFor());

        project.setLookingForCollaborators(
                request.isLookingForCollaborators()
        );


        Project updatedProject =
                projectRepo.save(project);

        return toDto(updatedProject);
    }


    // =====================================================
    // VERIFY OWNER
    // =====================================================

    private void verifyOwner(
            Project project,
            UserEntity currentUser) {

        if (!(project.getUser().getId() ==(currentUser.getId()))) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only the project owner can modify project settings"
            );
        }
    }


    // =====================================================
    // GET CURRENT USER
    // =====================================================

    private UserEntity getCurrentUser() {

        var authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }


    // =====================================================
    // ENTITY → DTO
    // =====================================================

    private ProjectSettingsDto toDto(Project project) {

        return ProjectSettingsDto.builder()
                .projectId(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .techStack(project.getTechStack())
                .githubUrl(project.getGithubUrl())
                .liveUrl(project.getLiveUrl())
                .image(project.getImage())
                .projectRole(project.getProjectRole())
                .teamSize(project.getTeamSize())
                .lookingFor(project.getLookingFor())
                .lookingForCollaborators(
                        project.isLookingForCollaborators()
                )
                .build();
    }
}

