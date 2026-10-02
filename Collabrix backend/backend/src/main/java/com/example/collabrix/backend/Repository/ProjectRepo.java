package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.Project;
import com.example.collabrix.backend.Entity.ProjectInterest;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Enum.InterestStatus;
import com.example.collabrix.backend.Enum.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepo extends JpaRepository<Project,Long> {
    List<Project> findByUserOrderByIdDesc(UserEntity user);
    List<Project> findAllByOrderByIdDesc();
    List<ProjectInterest> findByUserIdAndStatus(long user_id, ProjectStatus status );

    @Query("""
    SELECT p FROM Project p
    WHERE
        LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%'))
        OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))
        OR LOWER(p.techStack) LIKE LOWER(CONCAT('%', :query, '%'))
        OR LOWER(p.projectRole) LIKE LOWER(CONCAT('%', :query, '%'))
        OR LOWER(p.lookingFor) LIKE LOWER(CONCAT('%', :query, '%'))
    ORDER BY p.id DESC
""")
    List<Project> searchProjects(
            @Param("query") String query
    );


}

