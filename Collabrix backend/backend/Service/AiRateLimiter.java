// "package" says which folder this file lives in. It must match the real folder path,
// otherwise Java refuses to compile. Other classes use this to find us.
package com.example.collabrix.backend.Service;

// --- IMPORTS: each one pulls in a class that we use below. ---

// Our settings class from Step 2. We need it to read "max calls per minute".
import com.example.collabrix.backend.config.AiProperties;

// HttpStatus is a list of HTTP codes by name (OK, NOT_FOUND, TOO_MANY_REQUESTS...),
// so we write a word instead of a magic number like 429.
import org.springframework.http.HttpStatus;

// @Component tells Spring "create one object of this class and keep it".
import org.springframework.stereotype.Component;

// ResponseStatusException is an exception that Spring turns into an HTTP error.
// If we throw it, the user receives the status code we choose, not a crash.
import org.springframework.web.server.ResponseStatusException;

// Duration = a length of time (like "1 minute").
import java.time.Duration;

// Instant = one exact moment in time (like "right now").
import java.time.Instant;

// ArrayDeque is the actual list we use to store times.
import java.util.ArrayDeque;

// Deque is the *type* of that list: "double-ended queue". We can add or remove
// at both ends. We declare variables with this general type, not the specific class.
import java.util.Deque;

// Map = a lookup table: give it a key, get back a value.
import java.util.Map;

// ConcurrentHashMap = a Map that is safe when many threads use it at the same time.
import java.util.concurrent.ConcurrentHashMap;


// Without this, Spring would not know this class exists, and nobody could inject it.
// We use @Component (not @Service) because this is a helper, not business logic.
@Component
public class AiRateLimiter {

    // The time window: "N calls per ONE MINUTE".
    // static  = one copy shared by the whole class, not one per object.
    // final   = can never be reassigned (it is a constant).
    // Why a constant? So the number 1 minute lives in exactly one place.
    private static final Duration WINDOW = Duration.ofMinutes(1);

    // Our settings object (holds maxCallsPerMinute).
    // final = it is set once in the constructor and never changes.
    private final AiProperties props;

    // The memory of who called when.
    //   Key   (String)         = the user's identity, such as their email
    //   Value (Deque<Instant>) = the times of that user's recent calls, oldest first
    //
    // ConcurrentHashMap: two users can make requests at the same instant on
    // different threads. A normal HashMap can get corrupted in that case.
    private final Map<String, Deque<Instant>> calls = new ConcurrentHashMap<>();

    // CONSTRUCTOR. Spring sees this and says "this class needs an AiProperties",
    // finds the one it already built in Step 2, and passes it in.
    // That is dependency injection: we never write "new AiProperties()" ourselves.
    // It also makes testing easy, because a test can pass in any settings it wants.
    public AiRateLimiter(AiProperties props) {
        this.props = props;   // "this.props" is the field, "props" is the argument
    }

    // The only public method. The service calls this before every AI request.
    // If the user is allowed, it returns quietly. If not, it throws an exception.
    // "void" means it returns nothing: silence means "go ahead".
    public void check(String userKey) {

        // Get this user's list of call times. If they have none yet (first call),
        // create an empty list for them.
        // computeIfAbsent does "get or create" as ONE safe step.
        // "k -> new ArrayDeque<>()" means: given the key k, build a new empty list.
        Deque<Instant> times = calls.computeIfAbsent(userKey, k -> new ArrayDeque<>());

        // LOCK this user's list. Only one thread at a time can be inside the block.
        // Why? Imagine two requests from the same user at the same moment, with the
        // limit at 3 and 2 calls recorded. Without a lock, both read "2, so allowed"
        // and both add themselves, giving 4 calls. The lock forces them to go
        // one after the other: the second one sees 3 and is blocked.
        synchronized (times) {

            // The current moment. We read it ONCE and reuse it, so every line
            // below agrees on what "now" is.
            Instant now = Instant.now();

            // Anything older than this moment is outside the window and no longer counts.
            // "now minus 1 minute" = the oldest time that still counts.
            Instant cutoff = now.minus(WINDOW);

            // CLEAN UP: throw away expired call times from the front (oldest first).
            // !times.isEmpty()                 -> stop if the list is empty
            // times.peekFirst().isBefore(cutoff) -> is the oldest time older than cutoff?
            //     (peekFirst only LOOKS at the oldest entry, it does not remove it)
            // pollFirst()                      -> remove the oldest entry
            // "while", not "if": several entries might have expired, remove them all.
            // This must happen BEFORE counting, or expired calls would wrongly block the user.
            while (!times.isEmpty() && times.peekFirst().isBefore(cutoff)) {
                times.pollFirst();
            }

            // THE DECISION: how many calls remain inside the window?
            // If that already equals the limit, this call is one too many.
            if (times.size() >= props.maxCallsPerMinute()) {

                // 429 TOO_MANY_REQUESTS is the standard HTTP code for "slow down".
                // Throwing stops this method right here.
                // Spring converts the exception into the HTTP response, and
                // React can read the message and show it to the user.
                throw new ResponseStatusException(
                        HttpStatus.TOO_MANY_REQUESTS,
                        "Too many AI requests. Please wait a minute.");
            }

            // The user is allowed. RECORD this call at the back of the list (newest end),
            // so it counts toward their next check.
            // This line comes AFTER the if on purpose: blocked calls are not recorded.
            times.addLast(now);
        }
        // Leaving the synchronized block releases the lock automatically.
        // The method ends without an exception, which means "allowed".
    }
}