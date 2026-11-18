package com.example.collabrix.backend.Repository;


import com.example.collabrix.backend.Entity.Experience;
import com.example.collabrix.backend.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface experienceRepo  extends JpaRepository<Experience,Long> {
    List<Experience> findByUserOrderByStartDateDesc(UserEntity user);
}
