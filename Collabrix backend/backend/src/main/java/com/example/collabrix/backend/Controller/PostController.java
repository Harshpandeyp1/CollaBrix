package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.Post.CreatePost;
import com.example.collabrix.backend.Dto.Post.PostDto;
import com.example.collabrix.backend.Dto.Post.UpdatePost;
import com.example.collabrix.backend.Service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // Create Post
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostDto createPost(@RequestBody CreatePost request) {
        return postService.createPost(request);
    }

    // Discovery Feed
    @GetMapping
    public List<PostDto> getAllPosts() {
        return postService.getAllPosts();
    }

    // My Activity
    @GetMapping("/me")
    public List<PostDto> getMyPosts() {
        return postService.getMyPosts();
    }

    // Another User's Activity
    @GetMapping("/user/{userId}")
    public List<PostDto> getPostsByUser(@PathVariable Long userId) {
        return postService.getPostsByUser(userId);
    }

    // Single Post
    @GetMapping("/{id}")
    public PostDto getPost(@PathVariable Long id) {
        return postService.getPost(id);
    }

    // Update Post
    @PutMapping("/{id}")
    public PostDto updatePost(
            @PathVariable Long id,
            @RequestBody UpdatePost request) {

        return postService.updatePost(id, request);
    }

    // Delete Post
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable Long id) {
        postService.deletePost(id);
    }
}