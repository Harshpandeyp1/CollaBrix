package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<TaskEntity, Long> {

    List<TaskEntity> findByProjectIdOrderByCreatedAtDesc(Long projectId);

}