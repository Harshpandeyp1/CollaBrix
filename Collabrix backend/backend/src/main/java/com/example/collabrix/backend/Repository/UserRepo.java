package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<UserEntity,Long> {
    Optional<UserEntity> findByEmail(String email);

    static boolean existsByEmail(String email)//chck username already register
    {
        return false;
    }

    static boolean existsByUsername(String username)//username alreadyy taken
    {
        return false;
    }
}
