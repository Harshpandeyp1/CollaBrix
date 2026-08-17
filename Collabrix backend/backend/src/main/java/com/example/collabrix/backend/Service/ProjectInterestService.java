
        package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.Project.ProjectInterestDto;
import com.example.collabrix.backend.Entity.Project;
import com.example.collabrix.backend.Entity.ProjectInterest;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Enum.InterestStatus;
import com.example.collabrix.backend.Enum.NotificationType;
import com.example.collabrix.backend.Repository.ProjectInterestRepo;
import com.example.collabrix.backend.Repository.ProjectRepo;
import com.example.collabrix.backend.Repository.UserRepo;
import com.example.collabrix.backend.exception.ResourceNotFoundException;
import com.example.collabrix.backend.mapper.ProjectInterestMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectInterestService {

    private final ProjectInterestRepo interestRepo;
    private final ProjectRepo projectRepo;
    private final UserRepo userRepo;
    private final ProjectInterestMapper interestMapper;
    private final NotificationService notificationService;

    // =========================================
    // CURRENT USER
    // =========================================

    private UserEntity getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));
    }


    // =========================================
    // CHECK PROJECT OWNER
    // =========================================

    private void verifyProjectOwner(
            Project project,
            UserEntity currentUser
    ) {

        if (project.getUser().getId() != currentUser.getId()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only the project owner can perform this action"
            );
        }
    }


    // =========================================
    // SEND INTEREST
    // =========================================

    @Transactional
    public ProjectInterestDto sendInterest(Long projectId) {

        UserEntity currentUser = getCurrentUser();

        Project project = projectRepo.findById(projectId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found"
                        ));


        // -----------------------------------------
        // OWNER CANNOT SHOW INTEREST IN OWN PROJECT
        // -----------------------------------------

        if (project.getUser().getId() == currentUser.getId()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot show interest in your own project"
            );
        }


        // -----------------------------------------
        // CHECK DUPLICATE INTEREST
        // -----------------------------------------

        if (interestRepo
                .findByProjectIdAndUserId(
                        projectId,
                        currentUser.getId()
                )
                .isPresent()) {

            throw new IllegalStateException(
                    "You have already shown interest in this project"
            );
        }


        // -----------------------------------------
        // CREATE INTEREST
        // -----------------------------------------

        ProjectInterest interest =
                ProjectInterest.builder()
                        .project(project)
                        .user(currentUser)
                        .status(InterestStatus.PENDING)
                        .build();


        ProjectInterest saved =
                interestRepo.save(interest);
        notificationService.createNotification(
                project.getUser(),
                currentUser,
                NotificationType.PROJECT_INTEREST,
                currentUser.getUsername() + " is interested in your project \""
                        + project.getTitle() + "\"",
                project.getId()
        );

        return interestMapper.toDto(saved);
    }


    // =========================================
    // GET INTERESTS FOR PROJECT OWNER
    // =========================================

    public List<ProjectInterestDto> getProjectInterests(
            Long projectId
    ) {

        UserEntity currentUser = getCurrentUser();

        Project project = projectRepo.findById(projectId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found"
                        ));


        // -----------------------------------------
        // ONLY OWNER CAN SEE APPLICANTS
        // -----------------------------------------

        verifyProjectOwner(
                project,
                currentUser
        );


        return interestRepo
                .findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream()
                .map(interestMapper::toDto)
                .toList();
    }


    // =========================================
    // ACCEPT / REJECT
    // =========================================

    @Transactional
    public ProjectInterestDto updateInterestStatus(
            Long interestId,
            InterestStatus status
    ) {

        UserEntity currentUser = getCurrentUser();

        ProjectInterest interest =
                interestRepo.findById(interestId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Interest not found"
                                ));


        Project project = interest.getProject();


        // -----------------------------------------
        // ONLY PROJECT OWNER CAN ACCEPT / REJECT
        // -----------------------------------------

        verifyProjectOwner(
                project,
                currentUser
        );


        // -----------------------------------------
        // UPDATE STATUS
        // -----------------------------------------

        interest.setStatus(status);

        ProjectInterest updated =
                interestRepo.save(interest);


        return interestMapper.toDto(updated);
    }


    // =========================================
    // CHECK MY INTEREST
    // =========================================

    public ProjectInterestDto getMyInterest(
            Long projectId
    ) {

        UserEntity currentUser = getCurrentUser();

        // Make sure project exists
        projectRepo.findById(projectId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found"
                        ));


        return interestRepo
                .findByProjectIdAndUserId(
                        projectId,
                        currentUser.getId()
                )
                .map(interestMapper::toDto)
                .orElse(null);
    }


    // =========================================
    // GET ALL MY INTERESTS
    // =========================================

    public List<ProjectInterestDto> getMyInterests() {

        UserEntity currentUser = getCurrentUser();

        return interestRepo
                .findByUserIdOrderByCreatedAtDesc(
                        currentUser.getId()
                )
                .stream()
                .map(interestMapper::toDto)
                .toList();
    }
}

