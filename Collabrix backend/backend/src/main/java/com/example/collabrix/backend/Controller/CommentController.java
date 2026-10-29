package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.Post.CommentDto;
import com.example.collabrix.backend.Dto.Post.CreateCommentRequest;
import com.example.collabrix.backend.Service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;


    // =========================================
    // CREATE COMMENT
    // =========================================

    @PostMapping("/api/posts/{postId}/comments")
    public ResponseEntity<CommentDto> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CreateCommentRequest request
    ) {

        CommentDto comment =
                commentService.createComment(postId, request);

        return ResponseEntity.ok(comment);
    }


    // =========================================
    // GET COMMENTS FOR POST
    // =========================================

    @GetMapping("/api/posts/{postId}/comments")
    public ResponseEntity<List<CommentDto>> getComments(
            @PathVariable Long postId
    ) {

        List<CommentDto> comments =
                commentService.getComments(postId);

        return ResponseEntity.ok(comments);
    }


    // =========================================
    // DELETE COMMENT
    // =========================================

    @DeleteMapping("/api/comments/{commentId}")
    public ResponseEntity<String> deleteComment(
            @PathVariable Long commentId
    ) {

        commentService.deleteComment(commentId);

        return ResponseEntity.ok(
                "Comment deleted successfully"
        );
    }


    // =========================================
    // GET COMMENT COUNT FOR POST
    // =========================================

    @GetMapping("/api/posts/{postId}/comments/count")
    public ResponseEntity<Map<String, Long>> getCommentCount(
            @PathVariable Long postId
    ) {

        long count = commentService.getCommentCountByPost(postId);

        Map<String, Long> response = new HashMap<>();
        response.put("postId", postId);
        response.put("commentCount", count);

        return ResponseEntity.ok(response);
    }
}