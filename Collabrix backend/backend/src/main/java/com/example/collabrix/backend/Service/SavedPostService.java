package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.Post.PostDto;
import com.example.collabrix.backend.Entity.Post;
import com.example.collabrix.backend.Entity.SavedPost;
import com.example.collabrix.backend.Repository.PostRepo;
import com.example.collabrix.backend.Repository.SavedPostRepository;
import com.example.collabrix.backend.mapper.PostMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedPostService {

    private final SavedPostRepository savedPostRepository;
    private final PostRepo postRepository;
    private final PostMapper postMapper;

    @Transactional
    public void save(Long userId, Long postId) {
        if (savedPostRepository.existsByUserIdAndPostId(userId, postId)) {
            return;
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

        if (post.getUser().getId() == userId) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot save your own post");
        }

        SavedPost savedPost = new SavedPost();
        savedPost.setUserId(userId);
        savedPost.setPost(post);
        savedPostRepository.save(savedPost);
    }

    @Transactional
    public void unsave(Long userId, Long postId) {
        savedPostRepository.deleteByUserIdAndPostId(userId, postId);
    }

    @Transactional(readOnly = true)
    public List<PostDto> getSavedPosts(Long userId) {
        return savedPostRepository.findByUserIdOrderBySavedAtDesc(userId).stream()
                .map(savedPost -> postMapper.toDto(savedPost.getPost()))
                .toList();
    }
}
