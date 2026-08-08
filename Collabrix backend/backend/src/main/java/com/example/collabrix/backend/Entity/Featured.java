package com.example.collabrix.backend.Entity;

import com.example.collabrix.backend.Enum.FeaturedType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="featured")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class Featured {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 2000)
    private String description;

    private String thumbnail;

    @Column(nullable = false)
    private String url;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FeaturedType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
}
