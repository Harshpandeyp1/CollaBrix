package com.example.collabrix.backend.mapper;

import com.example.collabrix.backend.Dto.Project.CreateProject;
import com.example.collabrix.backend.Dto.Project.ProjectDto;
import com.example.collabrix.backend.Dto.Project.UpdateProject;
import com.example.collabrix.backend.Entity.Project;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProjectMapper {
    Project toEntity(CreateProject request);

    ProjectDto toDto(Project project);

    List<ProjectDto> toDtoList(List<Project> projects);

    void updateEntityFromDto(
            UpdateProject request,
            @MappingTarget Project project
    );
}
