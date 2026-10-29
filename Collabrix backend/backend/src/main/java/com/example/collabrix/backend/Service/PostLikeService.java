package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Entity.Post;
import com.example.collabrix.backend.Entity.PostLikeEntity;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Repository.PostLikeRepo;
import com.example.collabrix.backend.Repository.PostRepo;
import com.example.collabrix.backend.Repository.UserRepo;
import com.example.collabrix.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostLikeService {

    private final PostLikeRepo postLikeRepo;
    private final PostRepo postRepo;
    private final UserRepo userRepo;


    // =========================================
    // GET CURRENT USER
    // =========================================

    private UserEntity getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }


    // =========================================
    // LIKE POST
    // =========================================

    public void likePost(Long postId) {

        UserEntity user = getCurrentUser();

        Post post = postRepo.findById(postId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Post not found"));


        // Check if already liked

        if (postLikeRepo.existsByPostIdAndUserId(
                postId,
                user.getId()
        )) {

            return;
        }


        // Create like

        PostLikeEntity like = PostLikeEntity.builder()
                .post(post)
                .user(user)
                .build();


        postLikeRepo.save(like);
    }


    // =========================================
    // UNLIKE POST
    // =========================================

    public void unlikePost(Long postId) {

        UserEntity user = getCurrentUser();

        PostLikeEntity like =
                postLikeRepo
                        .findByPostIdAndUserId(
                                postId,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Like not found"
                                )
                        );

        postLikeRepo.delete(like);
    }


    // =========================================
    // LIKE COUNT
    // =========================================

    public long getLikeCount(Long postId) {

        return postLikeRepo.countByPostId(postId);
    }


    // =========================================
    // CHECK IF CURRENT USER LIKED
    // =========================================

    public boolean hasLiked(Long postId) {

        UserEntity user = getCurrentUser();

        return postLikeRepo.existsByPostIdAndUserId(
                postId,
                user.getId()
        );
    }
}