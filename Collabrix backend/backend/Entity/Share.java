package com.example.collabrix.backend.Entity;

import com.example.collabrix.backend.Enum.ShareItemType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "shares",
        indexes = @Index(name = "idx_share_recipient", columnList = "recipient_id")
)
@Getter
@Setter
@NoArgsConstructor
public class Share {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Column(name = "recipient_id", nullable = false)
    private Long recipientId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShareItemType itemType;

    @Column(nullable = false)
    private Long itemId;

    @Column(length = 500)
    private String message;

    @Column(nullable = false)
    private boolean seen = false;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}