package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.ProjectDiscussionMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectDiscussionMessageRepo
        extends JpaRepository<ProjectDiscussionMessage, Long> {

    List<ProjectDiscussionMessage> findByProjectIdOrderByCreatedAtAsc(
            Long projectId
    );
}