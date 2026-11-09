package com.example.collabrix.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * One row = "this user bookmarked this idea".
 * The unique constraint stops the same user saving the same idea twice.
 */
@Entity
@Table(
        name = "saved_ideas",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "idea_id"})
)
@Getter
@Setter
@NoArgsConstructor
public class SavedIdea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idea_id", nullable = false)
    private IdeaEntity idea;

    @Column(nullable = false)
    private LocalDateTime savedAt = LocalDateTime.now();
}