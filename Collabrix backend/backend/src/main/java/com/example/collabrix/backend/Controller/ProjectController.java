package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.common.ApiResponse;
import com.example.collabrix.backend.Dto.Project.CreateProject;
import com.example.collabrix.backend.Dto.Project.UpdateProject;
import com.example.collabrix.backend.Dto.Project.ProjectDto;
import com.example.collabrix.backend.Service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping("")
    public ResponseEntity<ApiResponse<ProjectDto>> createProject(
            @Valid @RequestBody CreateProject request
    ) {
        ProjectDto createdProject = projectService.createProject(request);
        ApiResponse<ProjectDto> response = new ApiResponse<>(
                true,
                "Project created successfully",
                createdProject
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getMyProjects() {
        List<ProjectDto> projects = projectService.getMyProjects();

        ApiResponse<List<ProjectDto>> response = new ApiResponse<>(
                true,
                "Projects fetched successfully",
                projects
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> getProjectById(
            @PathVariable Long id
    ) {
        ProjectDto project = projectService.getProjectById(id);

        ApiResponse<ProjectDto> response = new ApiResponse<>(
                true,
                "Project fetched successfully",
                project
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProject request
    ) {
        ProjectDto updatedProject = projectService.updateProject(id, request);

        ApiResponse<ProjectDto> response = new ApiResponse<>(
                true,
                "Project updated successfully",
                updatedProject
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @PathVariable Long id
    ) {
        projectService.deleteProject(id);

        ApiResponse<Void> response = new ApiResponse<>(
                true,
                "Project deleted successfully",
                null
        );

        return ResponseEntity.ok(response);
    }
}