package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.Idea.IdeaDto;
import com.example.collabrix.backend.Repository.UserRepo;
import com.example.collabrix.backend.Service.SavedIdeaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/saved-ideas")
@RequiredArgsConstructor
public class SavedIdeaController {

    private final SavedIdeaService savedIdeaService;
    private final UserRepo userRepo;

    private Long currentUserId(Authentication auth) {
        return userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Authenticated user not found"))
                .getId();
    }

    // Save an idea (works for any idea, including other people's)
    @PostMapping("/{ideaId}")
    public ResponseEntity<Void> save(@PathVariable Long ideaId,
                                     Authentication auth) {
        savedIdeaService.save(currentUserId(auth), ideaId);
        return ResponseEntity.created(ServletUriComponentsBuilder
                .fromCurrentRequest()
                .build()
                .toUri()).build();
    }

    // Remove from saved
    @DeleteMapping("/{ideaId}")
    public ResponseEntity<Void> unsave(@PathVariable Long ideaId,
                                       Authentication auth) {
        savedIdeaService.unsave(currentUserId(auth), ideaId);
        return ResponseEntity.noContent().build();
    }

    // All ideas the current user has saved, from any project / feed
    @GetMapping
    public ResponseEntity<List<IdeaDto>> getSaved(Authentication auth) {
        return ResponseEntity.ok(savedIdeaService.getSavedIdeas(currentUserId(auth)));
    }
}
