package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Service.PostLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostLikeController {

    private final PostLikeService postLikeService;

    // =========================================
    // LIKE
    // =========================================

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> likePost(
            @PathVariable Long postId
    ) {

        postLikeService.likePost(postId);

        return ResponseEntity.ok(
                "Post liked successfully"
        );
    }


    // =========================================
    // UNLIKE
    // =========================================

    @DeleteMapping("/{postId}/like")
    public ResponseEntity<?> unlikePost(
            @PathVariable Long postId
    ) {

        postLikeService.unlikePost(postId);

        return ResponseEntity.ok(
                "Post unliked successfully"
        );
    }


    // =========================================
    // LIKE COUNT
    // =========================================

    @GetMapping("/{postId}/likes")
    public ResponseEntity<Long> getLikeCount(
            @PathVariable Long postId
    ) {

        long count = postLikeService.getLikeCount(postId);

        return ResponseEntity.ok(count);
    }


    // =========================================
    // CURRENT USER LIKE STATUS
    // =========================================

    @GetMapping("/{postId}/liked")
    public ResponseEntity<Boolean> hasLiked(
            @PathVariable Long postId
    ) {

        boolean liked = postLikeService.hasLiked(postId);

        return ResponseEntity.ok(liked);
    }
}