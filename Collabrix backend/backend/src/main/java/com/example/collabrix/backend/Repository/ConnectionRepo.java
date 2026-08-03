package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.ConnectionEntity;
import com.example.collabrix.backend.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConnectionRepo extends JpaRepository <ConnectionEntity,Long>{

    Optional<ConnectionEntity> findBySenderAndReceiver(
            UserEntity sender,
            UserEntity receiver
    );
}
