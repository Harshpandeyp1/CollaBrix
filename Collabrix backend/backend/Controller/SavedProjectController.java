package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.Project.ProjectDto;
import com.example.collabrix.backend.Repository.UserRepo;
import com.example.collabrix.backend.Service.SavedProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/saved-projects")
@RequiredArgsConstructor
public class SavedProjectController {

    private final SavedProjectService savedProjectService;
    private final UserRepo userRepo;

    @PostMapping("/{projectId}")
    public ResponseEntity<Void> save(@PathVariable Long projectId, Authentication auth) {
        savedProjectService.save(currentUserId(auth), projectId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> unsave(@PathVariable Long projectId, Authentication auth) {
        savedProjectService.unsave(currentUserId(auth), projectId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ProjectDto>> getSavedProjects(Authentication auth) {
        return ResponseEntity.ok(savedProjectService.getSavedProjects(currentUserId(auth)));
    }

    private Long currentUserId(Authentication auth) {
        return userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Authenticated user not found"))
                .getId();
    }
}
