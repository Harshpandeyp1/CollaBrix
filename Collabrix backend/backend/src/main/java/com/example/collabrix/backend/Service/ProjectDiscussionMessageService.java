package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.Project.ProjectDiscussionMessageDto;
import com.example.collabrix.backend.Entity.Project;
import com.example.collabrix.backend.Entity.ProjectDiscussionMessage;
import com.example.collabrix.backend.Entity.ProjectInterest;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Enum.InterestStatus;
import com.example.collabrix.backend.Repository.ProjectDiscussionMessageRepo;
import com.example.collabrix.backend.Repository.ProjectInterestRepo;
import com.example.collabrix.backend.Repository.ProjectRepo;
import com.example.collabrix.backend.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectDiscussionMessageService {

    private final ProjectDiscussionMessageRepo discussionMessageRepo;
    private final ProjectRepo projectRepo;
    private final ProjectInterestRepo projectInterestRepo;
    private final UserRepo userRepo;


    // Get currently logged-in user
    private UserEntity getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }


    // Check whether current user can access this Playground
    private Project verifyAccess(Long projectId) {

        UserEntity currentUser = getCurrentUser();

        Project project = projectRepo.findById(projectId)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));


        // Project owner automatically has access
        if (project.getUser().getId()
                ==(currentUser.getId())) {

            return project;
        }


        // Check whether user is an accepted member
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


        // Pending/rejected users cannot access discussion
        if (interest.getStatus() != InterestStatus.ACCEPTED) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not an accepted member of this project"
            );
        }


        return project;
    }


    // Send a discussion message
    public ProjectDiscussionMessageDto sendMessage(
            Long projectId,
            String content) {

        UserEntity currentUser = getCurrentUser();

        Project project = verifyAccess(projectId);


        // Prevent empty messages
        if (content == null || content.trim().isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Message cannot be empty"
            );
        }


        ProjectDiscussionMessage message =
                ProjectDiscussionMessage.builder()
                        .project(project)
                        .sender(currentUser)
                        .content(content.trim())
                        .build();


        ProjectDiscussionMessage saved =
                discussionMessageRepo.save(message);


        return toDto(saved);
    }


    // Get all discussion messages
    public List<ProjectDiscussionMessageDto> getMessages(
            Long projectId) {

        // This is important:
        // We verify access BEFORE reading messages.
        verifyAccess(projectId);


        return discussionMessageRepo
                .findByProjectIdOrderByCreatedAtAsc(projectId)
                .stream()
                .map(this::toDto)
                .toList();
    }


    // Entity -> DTO
    private ProjectDiscussionMessageDto toDto(
            ProjectDiscussionMessage message) {

        UserEntity sender = message.getSender();

        return ProjectDiscussionMessageDto.builder()
                .id(message.getId())
                .senderId(sender.getId())
                .senderUsername(sender.getUsername())
                .senderProfileImage(sender.getProfileImage())
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .build();
    }
}