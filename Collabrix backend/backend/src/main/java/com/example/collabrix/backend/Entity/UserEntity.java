package com.example.collabrix.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name="users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {
   @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

   @Column(nullable = false,unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;


    private String fullName;

    @Column(length = 150)
    private String headline;

    @Column(length = 1000)
    private String bio;

    private String location;

    private String website;

    private String github;

    private String linkedin;

    private String profileImage;

    private String coverImage;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
