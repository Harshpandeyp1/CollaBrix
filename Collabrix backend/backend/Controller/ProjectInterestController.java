package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.Project.ProjectInterestDto;
import com.example.collabrix.backend.Enum.InterestStatus;
import com.example.collabrix.backend.Service.ProjectInterestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

import java.util.List;
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectInterestController {

    private final ProjectInterestService interestService;

    @PostMapping("/{projectId}/interest")
    public ResponseEntity<ProjectInterestDto> sendInterest(
            @PathVariable Long projectId
    ) {
        return ResponseEntity.ok(
                interestService.sendInterest(projectId)
        );
    }

    @GetMapping("/{projectId}/interests")
    public ResponseEntity<List<ProjectInterestDto>> getProjectInterests(
            @PathVariable Long projectId
    ) {
        return ResponseEntity.ok(
                interestService.getProjectInterests(projectId)
        );
    }

    @GetMapping("/{projectId}/interest")
    public ResponseEntity<ProjectInterestDto> getMyInterest(
            @PathVariable Long projectId
    ) {
        return ResponseEntity.ok(
                interestService.getMyInterest(projectId)
        );
    }

    @GetMapping("/interests/me")
    public ResponseEntity<List<ProjectInterestDto>> getMyInterests() {
        return ResponseEntity.ok(
                interestService.getMyInterests()
        );
    }

    @PutMapping("/interests/{interestId}")
    public ResponseEntity<ProjectInterestDto> updateInterestStatus(
            @PathVariable Long interestId,
            @RequestParam InterestStatus status
    ) {
        return ResponseEntity.ok(
                interestService.updateInterestStatus(
                        interestId,
                        status
                )
        );
    }
    @DeleteMapping("/interests/{interestId}")
    public ResponseEntity<Void> removeInterest(
            @PathVariable Long interestId
    ) {
        interestService.removeInterest(interestId);

        return ResponseEntity.noContent().build();
    }
}
