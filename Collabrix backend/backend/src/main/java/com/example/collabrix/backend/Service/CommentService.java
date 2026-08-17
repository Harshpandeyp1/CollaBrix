package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.Post.CommentDto;
import com.example.collabrix.backend.Dto.Post.CreateCommentRequest;
import com.example.collabrix.backend.Entity.Comment;
import com.example.collabrix.backend.Entity.Post;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Repository.CommentRepo;
import com.example.collabrix.backend.Repository.PostRepo;
import com.example.collabrix.backend.Repository.UserRepo;
import com.example.collabrix.backend.exception.ResourceNotFoundException;
import com.example.collabrix.backend.mapper.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepo commentRepo;
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
    // CREATE COMMENT
    // =========================================

    public CommentDto createComment(
            Long postId,
            CreateCommentRequest request
    ) {

        UserEntity user = getCurrentUser();

        Post post = postRepo.findById(postId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Post not found"));


        Comment comment = Comment.builder()
                .content(request.getContent())
                .user(user)
                .post(post)
                .build();


        Comment savedComment = commentRepo.save(comment);

        return CommentMapper.toDto(savedComment);
    }


    // =========================================
    // GET COMMENTS
    // =========================================

    public List<CommentDto> getComments(Long postId) {

        // First make sure post exists
        postRepo.findById(postId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Post not found"));


        return commentRepo
                .findByPostIdOrderByCreatedAtDesc(postId)
                .stream()
                .map(CommentMapper::toDto)
                .toList();
    }


    // =========================================
    // DELETE COMMENT
    // =========================================

    public void deleteComment(Long commentId) {

        UserEntity currentUser = getCurrentUser();

        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Comment not found"));

        commentRepo.delete(comment);
    }


    // =========================================
    // GET COMMENT COUNT FOR POST
    // =========================================

    public long getCommentCountByPost(Long postId) {

        postRepo.findById(postId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Post not found"));

        return commentRepo.countByPostId(postId);
    }
}