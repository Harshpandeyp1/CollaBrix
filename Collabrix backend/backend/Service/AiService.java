package com.example.collabrix.backend.Service;

// Our settings (the length limits) from Step 2.
import com.example.collabrix.backend.config.AiProperties;

// The shapes from Step 3: what comes in, what goes out.
import com.example.collabrix.backend.Dto.Ai.ImproveIdeaRequest;
import com.example.collabrix.backend.Dto.Ai.ImprovedIdeaDto;

// Lombok: adds a ready-made "log" variable to the class, so we can write
// log.error(...). It saves us writing the logger setup by hand.
import lombok.extern.slf4j.Slf4j;

// Spring AI's client. Spring gives us the one we built in AiConfig.
import org.springframework.ai.chat.client.ChatClient;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;

// @Service marks this as "business logic". It works like @Component, but the
// name tells readers what the class is for.
import org.springframework.stereotype.Service;

import org.springframework.web.server.ResponseStatusException;


@Slf4j      // creates the "log" variable used in the catch block below
@Service    // Spring creates one instance and injects it into the controller
public class AiService {

    // The three things this class needs. All final: set once, never changed.
    private final ChatClient ideaChatClient;   // talks to the model (rules from AiConfig)
    private final AiRateLimiter rateLimiter;   // enforces the quota
    private final AiProperties props;          // holds the length limits

    // CONSTRUCTOR INJECTION. Spring reads this and thinks:
    //   "I need a ChatClient"      -> finds the bean from AiConfig
    //   "I need an AiRateLimiter"  -> finds the @Component from Step 4
    //   "I need AiProperties"      -> finds the settings object from Step 2
    // and passes them in. We never write "new" for any of them.
    public AiService(@Qualifier("ideaChatClient") ChatClient ideaChatClient,
                     AiRateLimiter rateLimiter,
                     AiProperties props) {
        this.ideaChatClient = ideaChatClient;
        this.rateLimiter = rateLimiter;
        this.props = props;
    }

    // The only public method.
    //   userKey = who is asking (their email), used by the rate limiter
    //   request = the idea text from React
    public ImprovedIdeaDto improveIdea(String userKey, ImproveIdeaRequest request) {

        // ---------- 1. CLEAN ----------
        // The JSON may have left a field out, which Java reads as null.
        // Calling .trim() on null crashes with NullPointerException, so we
        // convert null to "" FIRST.
        String title = request.title() == null ? "" : request.title().trim();
        String description = request.description() == null ? "" : request.description().trim();

        // ---------- 2. VALIDATE ----------
        // Nothing to improve? Tell the user. 400 BAD_REQUEST = "your request is wrong".
        if (title.isEmpty() && description.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Write something first.");
        }

        // Too long? A huge input costs more money and could be abused,
        // so we cap it using the limits from application.properties.
        if (title.length() > props.maxTitleLength()
                || description.length() > props.maxDescriptionLength()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Your idea is too long.");
        }

        // ---------- 3. RATE LIMIT ----------
        // Throws a 429 if the user is over their quota; otherwise it returns
        // quietly. It is OUTSIDE the try/catch below on purpose: if it were
        // inside, the catch would swallow the 429 and turn it into a 502.
        rateLimiter.check(userKey);

        // ---------- 4. CALL THE MODEL ----------
        try {
            return ideaChatClient

                    // Start building one request.
                    .prompt()

                    // The USER message. Look at the shape:
                    //   .text("... {title} ... {description}")  = a template with placeholders
                    //   .param("title", title)                  = fills {title}
                    //
                    // WHY not just "Title: " + title + ...? Because the user's own text
                    // may contain curly braces like {x}, and Spring AI would try to treat
                    // those as placeholders and crash. Values inserted with .param()
                    // are plain text and are never searched for placeholders.
                    .user(u -> u
                            .text("Title: {title}\nDescription: {description}")
                            .param("title", title)
                            .param("description", description))

                    // SEND the request and WAIT for the reply (takes a few seconds).
                    .call()

                    // Convert the reply into our record: Spring AI adds the JSON
                    // format instructions to the prompt, then parses the model's answer.
                    .entity(ImprovedIdeaDto.class);

        } catch (Exception e) {

            // ---------- 5. HANDLE FAILURE ----------
            // Many things can fail here: no internet, wrong API key, model
            // not found, OpenRouter down, or unparseable JSON.
            //
            // The full error goes to OUR logs (with the stack trace).
            log.error("AI improveIdea failed", e);

            // The USER gets a safe, generic message. We never send e.getMessage()
            // to the browser, because it can contain internal details.
            // 502 BAD_GATEWAY = "a service I depend on failed".
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "The AI service is unavailable. Please try again.");
        }
    }
}
