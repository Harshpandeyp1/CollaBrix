package com.example.collabrix.backend.mapper;

import com.example.collabrix.backend.Dto.Post.CreatePost;
import com.example.collabrix.backend.Dto.Post.PostDto;
import com.example.collabrix.backend.Dto.Post.UpdatePost;
import com.example.collabrix.backend.Dto.Project.ProjectDto;
import com.example.collabrix.backend.Entity.Post;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Entity.Project;
import org.springframework.stereotype.Component;

@Component
public class PostMapper {

    public Post toEntity(CreatePost request) {

        if (request == null) {
            return null;
        }

        return Post.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .techStack(request.getTechStack())
                .rolesNeeded(request.getRolesNeeded())
                .status(request.getStatus())
                .teamSizeNeeded(request.getTeamSizeNeeded())
                .duration(request.getDuration())
                .githubUrl(request.getGithubUrl())
                .demoUrl(request.getDemoUrl())
                .bannerImage(request.getBannerImage())
                .tags(request.getTags())
                .build();
    }

    public PostDto toDto(Post post) {

        if (post == null) {
            return null;
        }

        UserEntity user = post.getUser();

        return PostDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .description(post.getDescription())
                .techStack(post.getTechStack())
                .rolesNeeded(post.getRolesNeeded())
                .status(post.getStatus())
                .teamSizeNeeded(post.getTeamSizeNeeded())
                .duration(post.getDuration())
                .githubUrl(post.getGithubUrl())
                .demoUrl(post.getDemoUrl())
                .bannerImage(post.getBannerImage())
                .tags(post.getTags())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())

                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .profileImage(user.getProfileImage())

                .projectId(
                        post.getProject() != null
                                ? post.getProject().getId()
                                : null
                )
                .project(toProjectDto(post.getProject())).build();
    }

    public void updateEntityFromDto(UpdatePost request, Post post) {

        if (request.getTitle() != null)
            post.setTitle(request.getTitle());

        if (request.getDescription() != null)
            post.setDescription(request.getDescription());

        if (request.getTechStack() != null)
            post.setTechStack(request.getTechStack());

        if (request.getRolesNeeded() != null)
            post.setRolesNeeded(request.getRolesNeeded());

        if (request.getStatus() != null)
            post.setStatus(request.getStatus());

        if (request.getTeamSizeNeeded() != null)
            post.setTeamSizeNeeded(request.getTeamSizeNeeded());

        if (request.getDuration() != null)
            post.setDuration(request.getDuration());

        if (request.getGithubUrl() != null)
            post.setGithubUrl(request.getGithubUrl());

        if (request.getDemoUrl() != null)
            post.setDemoUrl(request.getDemoUrl());

        if (request.getBannerImage() != null)
            post.setBannerImage(request.getBannerImage());

        if (request.getTags() != null)
            post.setTags(request.getTags());
    }
    private ProjectDto toProjectDto(Project project) {

        if (project == null) {
            return null;
        }

        ProjectDto dto = new ProjectDto();

        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setTechStack(project.getTechStack());
        dto.setGithubUrl(project.getGithubUrl());
        dto.setLiveUrl(project.getLiveUrl());
        dto.setImage(project.getImage());
        dto.setStatus(project.getStatus());
        dto.setLookingForCollaborators(
                project.isLookingForCollaborators()
        );

        return dto;
    }
}