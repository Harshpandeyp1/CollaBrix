package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.Post.CreatePost;
import com.example.collabrix.backend.Dto.Post.PostDto;
import com.example.collabrix.backend.Dto.Post.UpdatePost;
import com.example.collabrix.backend.Entity.Post;
import com.example.collabrix.backend.Entity.Project;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Repository.PostRepo;
import com.example.collabrix.backend.Repository.ProjectRepo;
import com.example.collabrix.backend.Repository.UserRepo;
import com.example.collabrix.backend.exception.ResourceNotFoundException;
import com.example.collabrix.backend.mapper.PostMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepo postRepository;

    private final UserRepo userRepository;

    private final PostMapper postMapper;

    private final ProjectRepo projectRepo;

    private UserEntity getCurrentUser(){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        String email=authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(()->new ResourceNotFoundException("User not found"));
    }
    private Post getPostForCurrentUser(Long id){
        Post post=postRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Post not found"));

        UserEntity currentUser=getCurrentUser();

        return post;
    }
    @Transactional

    public PostDto createPost(CreatePost request) {

        UserEntity currentUser = getCurrentUser();

        Post post = postMapper.toEntity(request);

        post.setUser(currentUser);

        // If this post is associated with a project
        if (request.getProjectId() != null) {

            Project project = projectRepo.findById(request.getProjectId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Project not found"));



            post.setProject(project);
        }

        Post saved = postRepository.save(post);

        return postMapper.toDto(saved);
    }
    public List<PostDto> getAllPosts() {

        return postRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(postMapper::toDto)
                .toList();
    }
    public List<PostDto> getMyPosts() {

        UserEntity currentUser = getCurrentUser();

        return postRepository.findByUser(currentUser)
                .stream()
                .map(postMapper::toDto)
                .toList();
    }
    public List<PostDto> getPostsByUser(Long userId) {

        return postRepository.findByUserId(userId)
                .stream()
                .map(postMapper::toDto)
                .toList();
    }
    public PostDto getPost(Long id) {

        Post post = postRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Post not found"));

        return postMapper.toDto(post);
    }
    @Transactional
    public PostDto updatePost(Long id, UpdatePost request) {

        Post post = getPostForCurrentUser(id);

        postMapper.updateEntityFromDto(request, post);

        if (request.getProjectId() != null) {

            Project project = projectRepo.findById(request.getProjectId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Project not found"));

            UserEntity currentUser = getCurrentUser();



            post.setProject(project);

        } else {
            // Remove project association if projectId is null
            post.setProject(null);
        }

        Post updated = postRepository.save(post);

        return postMapper.toDto(updated);
    }
    @Transactional
    public void deletePost(Long id) {

        Post post = getPostForCurrentUser(id);

        postRepository.delete(post);
    }
}
