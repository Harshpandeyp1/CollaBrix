package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.Share;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShareRepository extends JpaRepository<Share, Long> {

    List<Share> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);

    long countByRecipientIdAndSeenFalse(Long recipientId);
}