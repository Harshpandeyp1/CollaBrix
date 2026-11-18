package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.ProjectActivityEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectActivityRepository
        extends JpaRepository<ProjectActivityEntity, Long> {

    List<ProjectActivityEntity> findByProjectIdOrderByCreatedAtDesc(
            Long projectId
    );
}