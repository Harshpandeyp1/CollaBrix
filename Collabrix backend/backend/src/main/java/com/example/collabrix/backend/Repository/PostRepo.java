package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.Post;
import com.example.collabrix.backend.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;

public interface PostRepo extends JpaRepository<Post, Long> {

    List<Post> findByUser(UserEntity user);

    List<Post> findByUserId(Long userId);

    List<Post> findAllByOrderByCreatedAtDesc();
}