// Same package as the class we test. That matches the folder and lets the test
// see the class without extra imports.
package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.config.AiProperties;

// @Test marks a method as "run this as a test". It comes from JUnit, Spring Boot's
// default test framework.
import org.junit.jupiter.api.Test;

// We import this because the limiter throws it, and we want to inspect it.
import org.springframework.web.server.ResponseStatusException;

// "import static" lets us write assertEquals(...) instead of Assertions.assertEquals(...).
// The * imports all assertions (assertEquals, assertThrows, assertDoesNotThrow...).
import static org.junit.jupiter.api.Assertions.*;

// A plain class. No Spring annotations, so this test does not start the app.
// That makes it run in milliseconds and need no environment variables.
class AiRateLimiterTest {

    // A HELPER method (not a test, because it has no @Test).
    // Three tests need a limiter, so we build it in one place instead of copy-pasting.
    // We create AiProperties BY HAND: new AiProperties(maxCalls, titleLen, descLen).
    // Only the first number matters here. 150 and 2000 are filler values.
    // This is possible because the limiter takes its settings through its constructor.
    private AiRateLimiter limiterWithMax(int max) {
        return new AiRateLimiter(new AiProperties(max, 150, 2000));
    }

    // TEST 1: calls up to the limit are allowed.
    // Test names should read like a sentence describing the behavior we expect.
    @Test
    void allowsCallsUpToTheLimit() {

        // ARRANGE: a fresh limiter that allows 3 calls.
        // Each test builds its OWN limiter. Tests must never share state,
        // otherwise one test's calls could make another test fail.
        AiRateLimiter limiter = limiterWithMax(3);

        // ACT + ASSERT: assertDoesNotThrow passes only if the code inside runs
        // without throwing. "() -> { ... }" is a small block of code handed to it.
        // Three calls are exactly at the limit, so none of them may throw.
        assertDoesNotThrow(() -> {
            limiter.check("a@test.com");
            limiter.check("a@test.com");
            limiter.check("a@test.com");
        });
    }

    // TEST 2: the call AFTER the limit is blocked, with the right status code.
    @Test
    void blocksTheCallAfterTheLimit() {

        // ARRANGE
        AiRateLimiter limiter = limiterWithMax(3);

        // These three should succeed. If one threw, the test would fail right here,
        // which is what we want: the setup itself must work.
        limiter.check("a@test.com");
        limiter.check("a@test.com");
        limiter.check("a@test.com");

        // ACT: the 4th call. assertThrows passes ONLY if the code throws the
        // exception type we name. It also RETURNS that exception so we can examine it.
        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> limiter.check("a@test.com"));

        // ASSERT: check it is really the 429 "too many requests" error and not some
        // other failure. assertEquals(expected, actual): the expected value goes first.
        // getStatusCode().value() turns the status into its number.
        assertEquals(429, ex.getStatusCode().value());
    }

    // TEST 3: limits are per user. One person using their quota must not block others.
    // This one protects against a real bug: using a single shared counter.
    @Test
    void eachUserHasTheirOwnLimit() {

        // ARRANGE: a limit of just 1 call.
        AiRateLimiter limiter = limiterWithMax(1);

        // User A uses up their one call.
        limiter.check("a@test.com");

        // ACT + ASSERT: user B is a different key, so they have their own empty list
        // and must still be allowed.
        assertDoesNotThrow(() -> limiter.check("b@test.com"));
    }
}