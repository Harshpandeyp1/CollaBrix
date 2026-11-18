package com.example.collabrix.backend.Dto.Post;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDto {

    private Long id;

    private String content;

    private Long userId;

    private String username;

    private Long postId;

    private String createdAt;
}