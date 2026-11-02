package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.config.AiProperties;
import com.example.collabrix.backend.Dto.Ai.ImproveIdeaRequest;
import com.example.collabrix.backend.Dto.Ai.ImprovedIdeaDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.function.Consumer;

// Static imports so we can write mock(...), when(...), any() without class prefixes.
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AiServiceTest {

    // The fakes and the real object under test. Declared here so every test can use them.
    private ChatClient chatClient;
    private AiRateLimiter limiter;
    private AiService service;

    // @BeforeEach runs before EVERY test, giving each test fresh objects.
    // Tests must not share state, so we rebuild everything each time.
    @BeforeEach
    void setUp() {

        // RETURNS_DEEP_STUBS: our code calls a long chain,
        // prompt().user().call().entity(). With this option every link in the
        // chain automatically returns another fake, so we can describe the whole
        // chain in one line later instead of mocking each step by hand.
        chatClient = mock(ChatClient.class, RETURNS_DEEP_STUBS);

        // A fake limiter: by default its check() does nothing, i.e. "allowed".
        limiter = mock(AiRateLimiter.class);

        // The REAL service, wired with fakes and test settings (10 calls, 150, 2000).
        service = new AiService(chatClient, limiter, new AiProperties(10, 150, 2000));
    }

    // Helper to keep the tests short.
    private ImproveIdeaRequest req(String title, String description) {
        return new ImproveIdeaRequest(title, description);
    }

    // TEST 1: an empty idea is rejected with 400, and NOTHING expensive happens.
    @Test
    void emptyIdeaIsRejectedBeforeAnythingElse() {

        // Both fields blank. The spaces test that trim() works.
        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> service.improveIdea("a@test.com", req(null, "   ")));

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());

        // verifyNoInteractions = "this fake was never touched". It proves we
        // failed fast and neither used a quota slot nor called the model.
        verifyNoInteractions(limiter);
        verifyNoInteractions(chatClient);
    }

    // TEST 2: too-long input is rejected with 400.
    @Test
    void tooLongTitleIsRejected() {

        // "x".repeat(151) builds a 151-character string. The limit is 150.
        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> service.improveIdea("a@test.com", req("x".repeat(151), "ok")));

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        verifyNoInteractions(chatClient);
    }

    // TEST 3: when the limiter says no, the 429 reaches the caller and the model
    // is never called. It also proves our try/catch does not turn a 429 into a 502.
    @Test
    void rateLimitBlocksBeforeTheModelIsCalled() {

        // Teach the fake limiter: "when check() is called with any text, throw 429".
        doThrow(new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "slow down"))
                .when(limiter).check(any());

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> service.improveIdea("a@test.com", req("dark mode", "ok")));

        assertEquals(HttpStatus.TOO_MANY_REQUESTS, ex.getStatusCode());
        verifyNoInteractions(chatClient);
    }

    // TEST 4: the happy path. A valid request returns whatever the model gave us.
    @Test
    @SuppressWarnings("unchecked")   // silences a harmless generics warning on Consumer
    void validRequestReturnsTheModelsAnswer() {

        ImprovedIdeaDto expected = new ImprovedIdeaDto("Add a dark mode", "Helps at night.");

        // Teach the fake chain: "when our code runs prompt().user(...).call().entity(...),
        // answer with 'expected'". any(Consumer.class) means "whatever lambda was passed".
        when(chatClient.prompt()
                .user(any(Consumer.class))
                .call()
                .entity(ImprovedIdeaDto.class))
                .thenReturn(expected);

        ImprovedIdeaDto actual = service.improveIdea("a@test.com", req("dark mode", "ok"));

        assertEquals(expected, actual);

        // The limiter should have been used exactly once, with this user's key.
        verify(limiter).check("a@test.com");
    }

    // TEST 5: any model failure becomes a clean 502, never a raw crash.
    @Test
    @SuppressWarnings("unchecked")
    void modelFailureBecomesA502() {

        // Teach the fake chain to explode, like a wrong API key or a network error would.
        when(chatClient.prompt()
                .user(any(Consumer.class))
                .call()
                .entity(ImprovedIdeaDto.class))
                .thenThrow(new RuntimeException("boom: secret internal details"));

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> service.improveIdea("a@test.com", req("dark mode", "ok")));

        assertEquals(HttpStatus.BAD_GATEWAY, ex.getStatusCode());

        // The user-facing message must NOT leak the internal error text.
        assertFalse(ex.getReason().contains("boom"));
    }
}