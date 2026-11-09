package com.example.collabrix.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "saved_projects", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "project_id"}))
@Getter
@Setter
@NoArgsConstructor
public class SavedProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false, updatable = false)
    private LocalDateTime savedAt;

    @PrePersist
    void setSavedAt() {
        savedAt = LocalDateTime.now();
    }
}
