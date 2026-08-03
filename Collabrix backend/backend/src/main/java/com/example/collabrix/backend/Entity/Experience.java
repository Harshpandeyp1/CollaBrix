package com.example.collabrix.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "experience")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String company;

    private String position;

    private String employmentType;

    private String location;

    private String description;

    private LocalDate startDate;

    private LocalDate endDate;

    private boolean currentlyWorking;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;
}
