package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.ProjectFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectFileRepository
        extends JpaRepository<ProjectFileEntity, Long> {

    List<ProjectFileEntity> findByProjectIdOrderByCreatedAtDesc(
            Long projectId
    );
}