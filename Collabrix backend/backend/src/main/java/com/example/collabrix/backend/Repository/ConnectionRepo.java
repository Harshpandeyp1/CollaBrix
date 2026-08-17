package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.ConnectionEntity;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Enum.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

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

}
