package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.Post.PostDto;
import com.example.collabrix.backend.Repository.UserRepo;
import com.example.collabrix.backend.Service.SavedPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/saved-posts")
@RequiredArgsConstructor
public class SavedPostController {

    private final SavedPostService savedPostService;
    private final UserRepo userRepo;

    @PostMapping("/{postId}")
    public ResponseEntity<Void> save(@PathVariable Long postId, Authentication auth) {
        savedPostService.save(currentUserId(auth), postId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> unsave(@PathVariable Long postId, Authentication auth) {
        savedPostService.unsave(currentUserId(auth), postId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<PostDto>> getSavedPosts(Authentication auth) {
        return ResponseEntity.ok(savedPostService.getSavedPosts(currentUserId(auth)));
    }

    private Long currentUserId(Authentication auth) {
        return userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Authenticated user not found"))
                .getId();
    }
}
