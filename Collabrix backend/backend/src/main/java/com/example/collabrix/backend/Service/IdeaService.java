package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.Idea.CreateIdeaDto;
import com.example.collabrix.backend.Dto.Idea.IdeaDto;
import com.example.collabrix.backend.Dto.Idea.UpdateIdeaDto;
import com.example.collabrix.backend.Entity.*;
import com.example.collabrix.backend.Enum.InterestStatus;
import com.example.collabrix.backend.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IdeaService {

    private final IdeaRepository ideaRepository;
    private final ProjectRepo projectRepo;
    private final ProjectInterestRepo projectInterestRepo;
    private final UserRepo userRepo;
    private final ProjectActivityRepository activityRepository;


    // Get logged-in user from JWT
    private UserEntity getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }


    // Check whether user can access this project
    private Project verifyProjectAccess(Long projectId) {

        UserEntity currentUser = getCurrentUser();

        Project project =
                projectRepo.findById(projectId)
                        .orElseThrow(() ->
                                new RuntimeException("Project not found"));


        // Project owner automatically has access
        if (project.getUser().getId()==(currentUser.getId())) {
            return project;
        }


        // Otherwise check project membership
        ProjectInterest interest =
                projectInterestRepo
                        .findByProjectIdAndUserId(
                                projectId,
                                currentUser.getId()
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "You are not a member of this project"
                                ));


        // Member must be accepted
        if (interest.getStatus() != InterestStatus.ACCEPTED) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not an accepted member of this project"
            );
        }

        return project;
    }


    // Create a new idea
    public IdeaDto createIdea(
            Long projectId,
            CreateIdeaDto request) {

        UserEntity currentUser = getCurrentUser();

        Project project = verifyProjectAccess(projectId);


        // Validate title
        if (request.getTitle() == null ||
                request.getTitle().trim().isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Idea title cannot be empty"
            );
        }


        IdeaEntity idea =
                IdeaEntity.builder()
                        .title(request.getTitle().trim())
                        .description(request.getDescription())
                        .project(project)
                        .createdBy(currentUser)
                        .build();


        IdeaEntity saved =
                ideaRepository.save(idea);

        ProjectActivityEntity activity =
                ProjectActivityEntity.builder()
                        .project(project)
                        .user(currentUser)
                        .action("IDEA_CREATED")
                        .description(
                                "Created idea: "
                                        + saved.getTitle()
                        )
                        .build();

        activityRepository.save(activity);

        return toDto(saved);
    }


    // Get all ideas of a project
    public List<IdeaDto> getIdeas(Long projectId) {

        verifyProjectAccess(projectId);

        return ideaRepository
                .findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream()
                .map(this::toDto)
                .toList();
    }


    // Convert Entity -> DTO
    private IdeaDto toDto(IdeaEntity idea) {

        UserEntity creator = idea.getCreatedBy();

        return IdeaDto.builder()
                .id(idea.getId())
                .title(idea.getTitle())
                .description(idea.getDescription())
                .createdById(creator.getId())
                .createdByUsername(creator.getUsername())
                .createdByProfileImage(creator.getProfileImage())
                .createdAt(idea.getCreatedAt())
                .build();
    }
    public IdeaDto updateIdea(
            Long ideaId,
            UpdateIdeaDto request) {

        UserEntity currentUser = getCurrentUser();

        IdeaEntity idea =
                ideaRepository.findById(ideaId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Idea not found"
                                ));

        Project project = idea.getProject();

        // First verify that the user belongs to the project
        verifyProjectAccess(project.getId());

        boolean isOwner =
                project.getUser().getId()==(currentUser.getId());

        boolean isIdeaCreator =
                idea.getCreatedBy().getId()==(currentUser.getId());

        // Only project owner or idea creator can update
        if (!isOwner && !isIdeaCreator) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only update your own idea"
            );
        }

        if (request.getTitle() != null &&
                !request.getTitle().trim().isEmpty()) {

            idea.setTitle(request.getTitle().trim());
        }

        if (request.getDescription() != null) {
            idea.setDescription(request.getDescription());
        }

        IdeaEntity updated =
                ideaRepository.save(idea);

        return toDto(updated);
    }
    public void deleteIdea(Long ideaId) {

        UserEntity currentUser = getCurrentUser();

        IdeaEntity idea =
                ideaRepository.findById(ideaId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Idea not found"
                                ));

        Project project = idea.getProject();

        // User must at least belong to the project
        verifyProjectAccess(project.getId());

        boolean isOwner =
                project.getUser().getId()==(currentUser.getId());

        boolean isIdeaCreator =
                idea.getCreatedBy().getId()==(currentUser.getId());

        // Owner or creator can delete
        if (!isOwner && !isIdeaCreator) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only delete your own idea"
            );
        }

        ideaRepository.delete(idea);
    }
}