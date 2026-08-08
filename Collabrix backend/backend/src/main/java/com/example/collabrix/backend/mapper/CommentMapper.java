package com.example.collabrix.backend.mapper;

import com.example.collabrix.backend.Dto.Post.CommentDto;
import com.example.collabrix.backend.Entity.Comment;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {

    public static CommentDto toDto(Comment comment) {

        return CommentDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .userId(comment.getUser().getId())
                .username(comment.getUser().getUsername())
                .postId(comment.getPost().getId())
                .createdAt(
                        comment.getCreatedAt() != null
                                ? comment.getCreatedAt().toString()
                                : null
                )
                .build();
    }
}