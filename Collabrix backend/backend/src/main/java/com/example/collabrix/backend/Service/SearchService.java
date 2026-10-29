package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.Search.SearchProjectDto;
import com.example.collabrix.backend.Dto.Search.SearchResponseDto;
import com.example.collabrix.backend.Dto.Search.SearchUserDto;
import com.example.collabrix.backend.Entity.Project;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Repository.ProjectRepo;
import com.example.collabrix.backend.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final UserRepo userRepo;
    private final ProjectRepo projectRepo;

    public SearchResponseDto search(String query) {

        UserEntity currentUser = getCurrentUser();

        List<UserEntity> users =
                userRepo.searchUsers(query, currentUser.getId());

        List<Project> projects =
                projectRepo.searchProjects(query);

        List<SearchUserDto> userResults = users.stream()
                .map(user -> SearchUserDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .headline(user.getHeadline())
                        .profileImage(user.getProfileImage())
                        .build())
                .toList();

        List<SearchProjectDto> projectResults = projects.stream()
                .map(project -> SearchProjectDto.builder()
                        .id(project.getId())
                        .title(project.getTitle())
                        .description(project.getDescription())
                        .techStack(project.getTechStack())
                        .image(project.getImage())
                        .ownerId(project.getUser().getId())
                        .ownerUsername(project.getUser().getUsername())
                        .build())
                .toList();

        return SearchResponseDto.builder()
                .users(userResults)
                .projects(projectResults)
                .build();
    }

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
}