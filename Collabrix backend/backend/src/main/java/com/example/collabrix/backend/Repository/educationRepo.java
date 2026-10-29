package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.Education;
import com.example.collabrix.backend.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface educationRepo extends JpaRepository<Education,Long> {
    List<Education> findByUserOrderByStartDateDesc(UserEntity user);
}
