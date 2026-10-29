package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.SavedPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavedPostRepository extends JpaRepository<SavedPost, Long> {

    boolean existsByUserIdAndPostId(Long userId, Long postId);

    void deleteByUserIdAndPostId(Long userId, Long postId);

    List<SavedPost> findByUserIdOrderBySavedAtDesc(Long userId);
}
