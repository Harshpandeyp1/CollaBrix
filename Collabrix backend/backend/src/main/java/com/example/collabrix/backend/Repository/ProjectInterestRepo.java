package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.ProjectInterest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectInterestRepo
        extends JpaRepository<ProjectInterest, Long> {

    Optional<ProjectInterest> findByProjectIdAndUserId(
            Long projectId,
            Long userId
    );

    List<ProjectInterest> findByProjectIdOrderByCreatedAtDesc(
            Long projectId
    );
    List<ProjectInterest> findByUserIdOrderByCreatedAtDesc(Long userId);
}