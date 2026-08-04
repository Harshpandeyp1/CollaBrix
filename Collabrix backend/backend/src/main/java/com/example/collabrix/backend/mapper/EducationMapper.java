package com.example.collabrix.backend.mapper;

import com.example.collabrix.backend.Dto.Education.CreateEducation;
import com.example.collabrix.backend.Dto.Education.EducationDto;
import com.example.collabrix.backend.Dto.Education.UpdateEducation;
import com.example.collabrix.backend.Entity.Education;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EducationMapper {
    Education toEntity(CreateEducation request);
    EducationDto toDto(Education education);
    List<EducationDto> toDtoList(List<Education> education);

    void updateEntityFromDto(
            UpdateEducation request,
            @MappingTarget Education education
    );
}