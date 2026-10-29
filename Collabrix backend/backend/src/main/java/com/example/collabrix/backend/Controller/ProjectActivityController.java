package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.Activity.ProjectActivityDto;
import com.example.collabrix.backend.Service.ProjectActivityService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playground")
@RequiredArgsConstructor
public class ProjectActivityController {

    private final ProjectActivityService projectActivityService;


    @GetMapping("/{projectId}/activity")
    public ResponseEntity<List<ProjectActivityDto>> getActivities(
            @PathVariable Long projectId) {

        List<ProjectActivityDto> activities =
                projectActivityService.getActivities(projectId);

        return ResponseEntity.ok(activities);
    }
}