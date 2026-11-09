package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.config.AiProperties;
import com.example.collabrix.backend.Dto.Ai.ProjectPlanDto;
import com.example.collabrix.backend.Entity.IdeaEntity;
import com.example.collabrix.backend.Repository.IdeaRepository;
import com.example.collabrix.backend.Repository.SavedIdeaRepository;
import com.example.collabrix.backend.Repository.UserRepo;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;

// We now have TWO ChatClient beans, so we must say which one we want.
import org.springframework.beans.factory.annotation.Qualifier;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


@Slf4j
@Service
public class AiPlanService {

    // The planner's own client: same type as in AiService, but this one carries
    // PLAN_SYSTEM_PROMPT (set in AiConfig).
    private final ChatClient planChatClient;

    private final AiRateLimiter rateLimiter;        // ONE quota shared by all AI features
    private final AiProperties props;               // we reuse the length limits
    private final IdeaRepository ideaRepository;    // loads the idea
    private final SavedIdeaRepository savedIdeaRepository;  // "did this user save it?"
    private final UserRepo userRepo;                // turns an email into a user id

    // @Qualifier("planChatClient") = "give me the bean with exactly this name",
    // i.e. the method name in AiConfig. Without it Spring sees two ChatClients
    // and refuses to guess.
    public AiPlanService(@Qualifier("planChatClient") ChatClient planChatClient,
                         AiRateLimiter rateLimiter,
                         AiProperties props,
                         IdeaRepository ideaRepository,
                         SavedIdeaRepository savedIdeaRepository,
                         UserRepo userRepo) {
        this.planChatClient = planChatClient;
        this.rateLimiter = rateLimiter;
        this.props = props;
        this.ideaRepository = ideaRepository;
        this.savedIdeaRepository = savedIdeaRepository;
        this.userRepo = userRepo;
    }

    // NOTE: there is no @Transactional on this method, on purpose.
    // A transaction keeps a database connection busy until the method ends.
    // The model call below takes several seconds, and holding a connection that long
    // would starve other requests. Each repository call here opens and closes its own
    // short transaction automatically.
    public ProjectPlanDto planFromIdea(String userEmail, Long ideaId) {

        // ---------- 1. FIND THE USER ----------
        Long userId = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found."))
                .getId();

        // ---------- 2. FIND THE IDEA ----------
        // The text comes from OUR database, never from the request.
        IdeaEntity idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Idea not found."));

        // ---------- 3. CHECK PERMISSION ----------
        // Rule: you can plan from an idea you have saved.
        // 403 FORBIDDEN means "I know who you are, and the answer is no".
        if (!savedIdeaRepository.existsByUserIdAndIdeaId(userId, ideaId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Save this idea first to turn it into a plan.");
        }

        // ---------- 4. RATE LIMIT ----------
        // The same limiter as "Improve with AI", so a user has ONE quota across
        // every AI feature. Stays OUTSIDE the try/catch so its 429 isn't turned into a 502.
        rateLimiter.check(userEmail);

        // ---------- 5. CALL THE MODEL ----------
        ProjectPlanDto plan;

        try {
            plan = planChatClient
                    .prompt()
                    .user(u -> u
                            .text("Title: {title}\nDescription: {description}")
                            .param("title", cap(idea.getTitle(), props.maxTitleLength()))
                            .param("description", cap(idea.getDescription(), props.maxDescriptionLength())))
                    .call()
                    .entity(ProjectPlanDto.class);

        } catch (Exception e) {
            log.error("AI planFromIdea failed for idea {}", ideaId, e);
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "The AI service is unavailable. Please try again.");
        }

        // ---------- 6. VALIDATE OUTPUT ----------
        // A plan with no milestones would give the user an empty screen.
        // This check is deliberately OUTSIDE the try block so it isn't
        // swallowed by the catch above.
        if (plan == null || plan.milestones() == null || plan.milestones().isEmpty()) {
            log.warn("AI returned an empty plan for idea {}", ideaId);
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "The AI could not make a plan. Please try again.");
        }

        return plan;
    }

    // Safety net: cap text to the configured max length. Also turns null into "".
    private String cap(String text, int max) {
        if (text == null) {
            return "";
        }
        return text.length() > max ? text.substring(0, max) : text;
    }
}
