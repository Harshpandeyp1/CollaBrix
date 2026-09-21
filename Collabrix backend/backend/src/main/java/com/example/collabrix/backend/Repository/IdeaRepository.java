package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.IdeaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IdeaRepository extends JpaRepository<IdeaEntity, Long> {

    List<IdeaEntity> findByProjectIdOrderByCreatedAtDesc(Long projectId);
}