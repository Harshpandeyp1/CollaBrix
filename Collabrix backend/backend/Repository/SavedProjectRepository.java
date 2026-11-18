package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.SavedProject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavedProjectRepository extends JpaRepository<SavedProject, Long> {

    boolean existsByUserIdAndProjectId(Long userId, Long projectId);

    void deleteByUserIdAndProjectId(Long userId, Long projectId);

    List<SavedProject> findByUserIdOrderBySavedAtDesc(Long userId);
}
