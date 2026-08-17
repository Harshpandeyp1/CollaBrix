package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.Project;
import com.example.collabrix.backend.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepo extends JpaRepository<Project,Long> {
    List<Project> findByUserOrderByIdDesc(UserEntity user);
    List<Project> findAllByOrderByIdDesc();
}

