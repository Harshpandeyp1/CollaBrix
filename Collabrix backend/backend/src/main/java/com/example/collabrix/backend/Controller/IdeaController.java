package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.Idea.CreateIdeaDto;
import com.example.collabrix.backend.Dto.Idea.IdeaDto;
import com.example.collabrix.backend.Dto.Idea.UpdateIdeaDto;
import com.example.collabrix.backend.Service.IdeaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/playground")
@RequiredArgsConstructor
public class IdeaController {

    private final IdeaService ideaService;

    @PostMapping("/{projectId}/ideas")
    public ResponseEntity<IdeaDto> createIdea(
            @PathVariable Long projectId,
            @RequestBody CreateIdeaDto request) {

        IdeaDto idea =
                ideaService.createIdea(projectId, request);

        return ResponseEntity.ok(idea);
    }

    @GetMapping("/{projectId}/ideas")
    public ResponseEntity<List<IdeaDto>> getIdeas(
            @PathVariable Long projectId) {

        List<IdeaDto> ideas =
                ideaService.getIdeas(projectId);

        return ResponseEntity.ok(ideas);
    }

    @PutMapping("/ideas/{ideaId}")
    public ResponseEntity<IdeaDto> updateIdea(
            @PathVariable Long ideaId,
            @RequestBody UpdateIdeaDto request) {

        IdeaDto updatedIdea =
                ideaService.updateIdea(ideaId, request);

        return ResponseEntity.ok(updatedIdea);
    }

    @DeleteMapping("/ideas/{ideaId}")
    public ResponseEntity<Void> deleteIdea(
            @PathVariable Long ideaId) {

        ideaService.deleteIdea(ideaId);

        return ResponseEntity.noContent().build();
    }
}