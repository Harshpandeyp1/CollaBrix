package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.NotificationEntity;
import com.example.collabrix.backend.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepo
        extends JpaRepository<NotificationEntity, Long> {

    List<NotificationEntity> findByRecipientOrderByCreatedAtDesc(
            UserEntity recipient
    );

    List<NotificationEntity> findByRecipientAndIsReadFalseOrderByCreatedAtDesc(
            UserEntity recipient
    );
}