package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.Project;
import com.example.collabrix.backend.Entity.ProjectInterest;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Enum.InterestStatus;
import com.example.collabrix.backend.Enum.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepo extends JpaRepository<Project,Long> {
    List<Project> findByUserOrderByIdDesc(UserEntity user);
    List<Project> findAllByOrderByIdDesc();
    List<ProjectInterest> findByUserIdAndStatus(long user_id, ProjectStatus status );
}

