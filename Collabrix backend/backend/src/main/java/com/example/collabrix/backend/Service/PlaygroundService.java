 package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.Playground.PlaygroundAccessDto;
import com.example.collabrix.backend.Dto.Playground.PlaygroundDetailDto;
import com.example.collabrix.backend.Entity.Project;
import com.example.collabrix.backend.Entity.ProjectInterest;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Enum.InterestStatus;
import com.example.collabrix.backend.Repository.ProjectInterestRepo;
import com.example.collabrix.backend.Repository.ProjectRepo;
import com.example.collabrix.backend.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

 @Service
 @RequiredArgsConstructor
 public class PlaygroundService {

     private final ProjectRepo projectRepo;
     private final UserRepo userRepo;
     private final ProjectInterestRepo projectInterestRepo;

     private UserEntity getCurrentUser() {
         Authentication authentication =
                 SecurityContextHolder.getContext().getAuthentication();

         String email = authentication.getName();

         return userRepo.findByEmail(email)
                 .orElseThrow(() ->
                         new RuntimeException("User not found"));
     }

     public PlaygroundDetailDto getAccessibleProject(Long projectId) {

         UserEntity currentUser = getCurrentUser();

         Project project = projectRepo.findById(projectId)
                 .orElseThrow(() ->
                         new RuntimeException("Project not Found"));

         if (project.getUser().getId()==(currentUser.getId())) {

             return PlaygroundDetailDto.builder()
                     .projectId(project.getId())
                     .projectTitle(project.getTitle())
                     .description(project.getDescription())
                     .techStack(project.getTechStack())
                     .githubUrl(project.getGithubUrl())
                     .image(project.getImage())
                     .teamSize(project.getTeamSize())
                     .status(project.getStatus())
                     .ownerUsername(project.getUser().getUsername())
                     .build();
         }

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

         if (interest.getStatus() != InterestStatus.ACCEPTED) {

             throw new ResponseStatusException(
                     HttpStatus.FORBIDDEN,
                     "You are not an accepted member of this project"
             );
         }

         return PlaygroundDetailDto.builder()
                 .projectId(project.getId())
                 .projectTitle(project.getTitle())
                 .description(project.getDescription())
                 .techStack(project.getTechStack())
                 .githubUrl(project.getGithubUrl())
                 .image(project.getImage())
                 .teamSize(project.getTeamSize())
                 .status(project.getStatus())
                 .ownerUsername(project.getUser().getUsername())
                 .build();
     }

     public List<PlaygroundAccessDto> getMyPlaygrounds() {

         UserEntity currentUser = getCurrentUser();

         List<Project> ownedProjects =
                 projectRepo.findByUserOrderByIdDesc(currentUser);

         List<ProjectInterest> acceptedInterests =
                 projectInterestRepo.findByUserIdAndStatus(
                         currentUser.getId(),
                         InterestStatus.ACCEPTED
                 );

         List<PlaygroundAccessDto> playgrounds =
                 new ArrayList<>();

         ownedProjects.forEach(project -> {

             playgrounds.add(
                     PlaygroundAccessDto.builder()
                             .projectId(project.getId())
                             .projectTitle(project.getTitle())
                             .ownerUsername(
                                     project.getUser().getUsername()
                             )
                             .build()
             );
         });

         acceptedInterests.forEach(interest -> {

             Project project = interest.getProject();

             playgrounds.add(
                     PlaygroundAccessDto.builder()
                             .projectId(project.getId())
                             .projectTitle(project.getTitle())
                             .ownerUsername(
                                     project.getUser().getUsername()
                             )
                             .build()
             );
         });

         return playgrounds;
     }
 }