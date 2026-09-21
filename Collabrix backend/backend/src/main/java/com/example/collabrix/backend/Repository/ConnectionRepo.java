package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.ConnectionEntity;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Enum.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConnectionRepo extends JpaRepository <ConnectionEntity,Long>{

    Optional<ConnectionEntity> findBySenderAndReceiver(
            UserEntity sender,
            UserEntity receiver
    );
    List<ConnectionEntity> findByReceiverAndStatus(
            UserEntity receiver,
            ConnectionStatus status
    );

    List<ConnectionEntity> findBySenderAndStatus(
            UserEntity sender,
            ConnectionStatus status
    );

    List<ConnectionEntity> findBySenderOrReceiver(
            UserEntity sender,
            UserEntity receiver
    );
    @Query("""
    SELECT c FROM ConnectionEntity c
    WHERE
        (c.sender = :user1 AND c.receiver = :user2)
        OR
        (c.sender = :user2 AND c.receiver = :user1)
""")
    Optional<ConnectionEntity> findConnectionBetweenUsers(
            @Param("user1") UserEntity user1,
            @Param("user2") UserEntity user2
    );

}
