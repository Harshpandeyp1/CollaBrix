package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.SavedIdea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface SavedIdeaRepository extends JpaRepository<SavedIdea, Long> {

    boolean existsByUserIdAndIdeaId(Long userId, Long ideaId);

    void deleteByUserIdAndIdeaId(Long userId, Long ideaId);

    List<SavedIdea> findByUserIdOrderBySavedAtDesc(Long userId);

    // Used to mark ideas as "savedByMe" when loading the feed / project ideas
    @Query("select s.idea.id from SavedIdea s where s.userId = :userId")
    Set<Long> findSavedIdeaIds(@Param("userId") Long userId);
}