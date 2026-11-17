package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.Ai.ImproveIdeaRequest;
import com.example.collabrix.backend.Dto.Ai.ImprovedIdeaDto;
import com.example.collabrix.backend.Dto.Ai.ProjectPlanDto;
import com.example.collabrix.backend.Service.AiPlanService;
import com.example.collabrix.backend.Service.AiService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


@RestController
@RequestMapping("/api/ai")
public class AiController {

    // One dependency per feature. The controller still knows nothing about
    // ChatClient, prompts, repositories or limits.
    private final AiService aiService;
    private final AiPlanService aiPlanService;

    public AiController(AiService aiService, AiPlanService aiPlanService) {
        this.aiService = aiService;
        this.aiPlanService = aiPlanService;
    }

    // ---------- FEATURE 1: improve an idea's text (unchanged apart from requireUser) ----------
    @PostMapping("/improve-idea")
    public ResponseEntity<ImprovedIdeaDto> improveIdea(@RequestBody ImproveIdeaRequest request,
                                                       Authentication auth) {
        return ResponseEntity.ok(aiService.improveIdea(requireUser(auth), request));
    }

    // ---------- FEATURE 2: turn a saved idea into a project plan ----------
    // "{ideaId}" in the path is a placeholder. For /api/ai/ideas/5/plan, ideaId = 5.
    // @PathVariable tells Spring to take that part of the URL and pass it in,
    // converted to a Long. There is no @RequestBody: the idea's text is loaded from
    // the database inside the service, never sent by the caller.
    @PostMapping("/ideas/{ideaId}/plan")
    public ResponseEntity<ProjectPlanDto> planFromIdea(@PathVariable Long ideaId,
                                                       Authentication auth) {
        return ResponseEntity.ok(aiPlanService.planFromIdea(requireUser(auth), ideaId));
    }

    // We had the same "if (auth == null)" check in one method. Now two methods need it,
    // so it moves into ONE private helper. That is the right moment to extract code:
    // when you have written it twice, not before. If the rule ever changes, you edit
    // one place. It returns the user's identity (their email) as a bonus.
    private String requireUser(Authentication auth) {
        if (auth == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please log in.");
        }
        return auth.getName();
    }
}