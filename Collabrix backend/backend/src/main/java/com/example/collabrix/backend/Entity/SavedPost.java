package com.example.collabrix.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "saved_posts", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "post_id"}))
@Getter
@Setter
@NoArgsConstructor
public class SavedPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Column(nullable = false, updatable = false)
    private LocalDateTime savedAt;

    @PrePersist
    void setSavedAt() {
        savedAt = LocalDateTime.now();
    }
}
