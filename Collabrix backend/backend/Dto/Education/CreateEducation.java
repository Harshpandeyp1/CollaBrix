package com.example.collabrix.backend.Dto.Education;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateEducation {

    @NotBlank
    private String institution;

    @NotBlank
    private String degree;

    @NotBlank
    private String fieldOfStudy;

    private LocalDate startDate;

    private LocalDate endDate;

    private boolean currentlyStudying;

    private String description;
}