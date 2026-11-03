package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.Ai.ImproveIdeaRequest;
import com.example.collabrix.backend.Dto.Ai.ImprovedIdeaDto;
import com.example.collabrix.backend.Service.AiService;

import org.springframework.http.HttpStatus;

// ResponseEntity lets us choose the HTTP status AND the body together.
import org.springframework.http.ResponseEntity;

// Authentication holds "who is logged in". Spring Security fills it from the
// login token (JWT or session) that came with the request.
import org.springframework.security.core.Authentication;

// Brings in @RestController, @RequestMapping, @PostMapping, @RequestBody.
import org.springframework.web.bind.annotation.*;

import org.springframework.web.server.ResponseStatusException;


// @RestController = "this class answers web requests, and what the methods return
// is written as JSON." (It is @Controller + @ResponseBody combined.)
@RestController

// A prefix for every URL in this class. Combined with the method's own path below:
//   /api/ai  +  /improve-idea  =  /api/ai/improve-idea
@RequestMapping("/api/ai")
public class AiController {

    // The ONLY thing the controller depends on: the service.
    // It never touches ChatClient, the limiter or the settings. That is the
    // service's business, which keeps this class tiny and easy to test.
    private final AiService aiService;

    // Spring injects the AiService bean from Step 6.
    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    // @PostMapping = "answer HTTP POST requests to /api/ai/improve-idea".
    // Why POST and not GET? We send a body, and the action costs money, so it
    // must not be triggered by something as casual as opening a link.
    @PostMapping("/improve-idea")
    public ResponseEntity<ImprovedIdeaDto> improveIdea(

            // @RequestBody: "take the JSON from the request body and turn it into
            // an ImproveIdeaRequest" by matching key names to record fields (Step 3).
            // If the body is missing or is not valid JSON, Spring replies 400 on its own.
            @RequestBody ImproveIdeaRequest request,

            // Spring injects the logged-in user. We do NOT take a "userId" from the
            // request body, because anyone could type someone else's id there.
            // Identity must come from the verified login, never from user input.
            Authentication auth) {

        // DEFENSIVE CHECK. Normally Spring Security stops anonymous users before
        // they get here, and auth is never null. But if someone later edits the
        // security rules and this URL becomes public by mistake, auth would be null,
        // and the next line would crash with a confusing NullPointerException
        // (a 500). This turns that mistake into a clean 401 instead.
        // Two locks are better than one: the security config AND this check.
        if (auth == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please log in.");
        }

        // auth.getName() is the logged-in user's identity. In your other controllers
        // you looked it up with userRepo.findByEmail(auth.getName()), so here it is
        // their email. We use it as the key for the rate limiter. It comes from the
        // verified token, so a user can't dodge the limit by pretending to be someone else.
        //
        // ResponseEntity.ok(x) = HTTP 200 with x as the JSON body.
        return ResponseEntity.ok(aiService.improveIdea(auth.getName(), request));
    }
}