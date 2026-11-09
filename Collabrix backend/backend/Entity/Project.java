package com.example.collabrix.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.example.collabrix.backend.Enum.ProjectStatus;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
@Getter
@Setter
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    private String techStack;

    private String githubUrl;

    private String liveUrl;

    private String image;

    private String projectRole;

    private int teamSize;

    private String lookingFor;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ProjectStatus status;

    private boolean lookingForCollaborators;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @OneToMany(
            mappedBy = "project",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ProjectDiscussionMessage> discussionMessages = new ArrayList<>();

    @OneToMany(
            mappedBy = "project",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<TaskEntity> tasks = new ArrayList<>();

    @OneToMany(
            mappedBy = "project",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<IdeaEntity> ideas = new ArrayList<>();

    @OneToMany(
            mappedBy = "project",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ProjectFileEntity> files = new ArrayList<>();
    @OneToMany(
            mappedBy = "project",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ProjectInterest> interests = new ArrayList<>();
    @OneToMany(
            mappedBy = "project",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ProjectActivityEntity> activities = new ArrayList<>();
    @OneToMany(
            mappedBy = "project",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Post> posts = new ArrayList<>();
}