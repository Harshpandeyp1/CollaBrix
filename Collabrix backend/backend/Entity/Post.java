package com.example.collabrix.backend.Entity;

import com.example.collabrix.backend.Enum.PostStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @CollectionTable(name = "post_tech_stack", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "tech_stack")
    @OrderColumn(name = "list_order")
    private List<String> techStack;

    @ElementCollection
    @CollectionTable(name = "post_roles_needed", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "roles_needed")
    @OrderColumn(name = "list_order")
    private List<String> rolesNeeded;

    @ElementCollection
    @CollectionTable(name = "post_tags", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "tags")
    @OrderColumn(name = "list_order")
    private List<String> tags;

    @Enumerated(EnumType.STRING)
    private PostStatus status;

    private Integer teamSizeNeeded;

    private String duration;

    private String githubUrl;

    private String demoUrl;

    private String bannerImage;


    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}