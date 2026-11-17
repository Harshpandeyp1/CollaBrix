
        package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.ProjectSettings.ProjectSettingsDto;
import com.example.collabrix.backend.Dto.ProjectSettings.UpdateProjectSettingsDto;
import com.example.collabrix.backend.Service.ProjectSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/playground")
@RequiredArgsConstructor
public class ProjectSettingsController {

    private final ProjectSettingsService projectSettingsService;


    // =====================================================
    // GET PROJECT SETTINGS
    // =====================================================

    @GetMapping("/{projectId}/settings")
    public ResponseEntity<ProjectSettingsDto> getProjectSettings(
            @PathVariable Long projectId) {

        ProjectSettingsDto settings =
                projectSettingsService.getProjectSettings(projectId);

        return ResponseEntity.ok(settings);
    }


    // =====================================================
    // UPDATE PROJECT SETTINGS
    // =====================================================

    @PutMapping("/{projectId}/settings")
    public ResponseEntity<ProjectSettingsDto> updateProjectSettings(
            @PathVariable Long projectId,
            @RequestBody UpdateProjectSettingsDto request) {

        ProjectSettingsDto updatedSettings =
                projectSettingsService.updateProjectSettings(
                        projectId,
                        request
                );

        return ResponseEntity.ok(updatedSettings);
    }
}


