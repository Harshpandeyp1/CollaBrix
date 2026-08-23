package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepo extends JpaRepository<MessageEntity, Long> {
}
