package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.MessageEntity;
import com.example.collabrix.backend.Entity.UserEntity;
import org.mapstruct.control.MappingControl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepo extends JpaRepository<MessageEntity, Long> {

    List<MessageEntity> findBySenderAndReceiverOrderByCreatedAtAsc(
            UserEntity sender,
            UserEntity receiver
    );

    List<MessageEntity> findByReceiverAndSenderOrderByCreatedAtAsc(
            UserEntity receiver,
            UserEntity sender
    );

    @Query("""
     SELECT m FROM MessageEntity m
     WHERE 
     (m.sender=:user1 AND m.receiver=:user2)
     OR 
     (m.sender=:user2 AND m.receiver=:user1)
     ORDER BY m.createdAt ASC

""")
    List<MessageEntity>findConversation(
            @Param("user1") UserEntity user1,
            @Param("user2") UserEntity user2
            );
    @Query("""
    SELECT m
    FROM MessageEntity m
    WHERE
        (m.sender = :user1 AND m.receiver = :user2)
        OR
        (m.sender = :user2 AND m.receiver = :user1)
    ORDER BY m.createdAt DESC
""")
    List<MessageEntity> findLatestConversationMessage(
            @Param("user1") UserEntity user1,
            @Param("user2") UserEntity user2
    );
}