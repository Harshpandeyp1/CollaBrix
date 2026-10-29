package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<UserEntity,Long> {
    Optional<UserEntity> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    List<UserEntity>findTop10ByIdNot(Long userId);
    List<UserEntity> findAllByIdNot(Long id);
    List<UserEntity> findTop10ByIdNotAndUsernameContainingIgnoreCaseOrIdNotAndFullNameContainingIgnoreCase(
            Long id1,
            String username,
            Long id2,
            String fullName
    );
    @Query("""
        SELECT u FROM UserEntity u
        WHERE u.id <> :currentUserId
        AND (
            LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(u.headline) LIKE LOWER(CONCAT('%', :query, '%'))
        )
        ORDER BY u.id DESC
    """)
    List<UserEntity> searchUsers(
            @Param("query") String query,
            @Param("currentUserId") Long currentUserId
    );
}
