package com.example.collabrix.backend.Dto.Education;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
@Data
public class EducationDto {

    private Long id;

    private String institution;

    private String degree;

    private String fieldOfStudy;

    private LocalDate startDate;

    private LocalDate endDate;

    private boolean currentlyStudying;

    private String description;
}