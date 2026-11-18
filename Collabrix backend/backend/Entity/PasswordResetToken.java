package com.example.collabrix.backend.Entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity   // "this class is a database table"

// Table name, plus an index on user_id. An index is a lookup shortcut: later we
// run "invalidate all tokens of this user" and without an index the database would
// scan every row. (token_hash needs no index line, because "unique" creates one.)
@Table(
        name = "password_reset_tokens",
        indexes = @Index(name = "idx_prt_user_id", columnList = "user_id")
)

@Getter   // Lombok: writes getters. We deliberately do NOT add @Setter (see above).

// JPA needs an empty constructor to build objects when it reads rows.
// PROTECTED means our own code can't call it by accident: the only public way
// to create a token is the constructor below, which forces all fields to be given.
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)   // the database numbers the rows
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    // unique = no two rows may share a hash. length = 64 for a hex SHA-256.
    @Column(name = "token_hash", nullable = false, unique = true, length = 64)
    private String tokenHash;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    // Nullable on purpose: null means "not used yet".
    @Column(name = "used_at")
    private Instant usedAt;

    // updatable = false: once written, the database ignores attempts to change it.
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    // The ONLY way to create one. The caller must supply all three things that
    // identify a reset request, so a half-filled token cannot exist.
    public PasswordResetToken(Long userId, String tokenHash, Instant expiresAt) {
        this.userId = userId;
        this.tokenHash = tokenHash;
        this.expiresAt = expiresAt;
    }

    // THE RULE for "can this token still reset a password?":
    //   not used yet AND the current moment is strictly before expiry.
    // "now" is passed in, not read inside with Instant.now(), so a test can pick
    // any moment it likes. This is the same trick as passing AiProperties in.
    public boolean isUsable(Instant now) {
        return usedAt == null && now.isBefore(expiresAt);
    }

    // Marks the token as spent. The service calls this after a successful reset.
    public void markUsed(Instant now) {
        this.usedAt = now;
    }
}