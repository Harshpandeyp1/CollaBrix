package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.ProjectMember.ProjectMemberDto;
import com.example.collabrix.backend.Entity.Project;
import com.example.collabrix.backend.Entity.ProjectInterest;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Enum.InterestStatus;
import com.example.collabrix.backend.Repository.ProjectInterestRepo;
import com.example.collabrix.backend.Repository.ProjectRepo;
import com.example.collabrix.backend.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectMemberService {

    private final ProjectRepo projectRepo;
    private final ProjectInterestRepo projectInterestRepo;
    private final UserRepo userRepo;

    public List<ProjectMemberDto> getProjectMembers(Long projectId) {

        UserEntity currentUser = getCurrentUser();

        Project project =
                projectRepo.findById(projectId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Project not found"
                                ));

        verifyProjectAccess(project, currentUser);

        List<ProjectMemberDto> members = new ArrayList<>();

        // Add project owner
        UserEntity owner = project.getUser();

        members.add(
                toDto(owner, "OWNER")
        );

        // Add accepted members
        List<ProjectInterest> acceptedInterests =
                projectInterestRepo.findByProjectIdAndStatus(
                        projectId,
                        InterestStatus.ACCEPTED
                );

        for (ProjectInterest interest : acceptedInterests) {

            UserEntity member = interest.getUser();

            // Owner is already added above
            if (member.getId()==(owner.getId())) {
                continue;
            }

            members.add(
                    toDto(member, "MEMBER")
            );
        }

        return members;
    }

    private void verifyProjectAccess(
            Project project,
            UserEntity currentUser) {

        if (project.getUser().getId()==(currentUser.getId())) {
            return;
        }

        projectInterestRepo
                .findByProjectIdAndUserId(
                        project.getId(),
                        currentUser.getId()
                )
                .filter(interest ->
                        interest.getStatus() == InterestStatus.ACCEPTED
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

        return userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    private ProjectMemberDto toDto(
            UserEntity user,
            String role) {

        return ProjectMemberDto.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .headline(user.getHeadline())
                .profileImage(user.getProfileImage())
                .role(role)
                .build();
    }

    public void removeMember(Long projectId, Long userId) {

        UserEntity currentUser = getCurrentUser();

        Project project =
                projectRepo.findById(projectId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Project not found"
                                ));

        // Only project owner can remove members
        if (project.getUser().getId() != currentUser.getId()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only the project owner can remove members"
            );
        }

        // Owner cannot remove themselves
        if (project.getUser().getId() == userId) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Project owner cannot be removed"
            );
        }

        ProjectInterest interest =
                projectInterestRepo
                        .findByProjectIdAndUserId(
                                projectId,
                                userId
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Member not found in this project"
                                ));

        // Only an accepted member can be removed
        if (interest.getStatus() != InterestStatus.ACCEPTED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "User is not an active member of this project"
            );
        }

        projectInterestRepo.delete(interest);
    }


}