package com.example.collabrix.backend.Repository;

import com.example.collabrix.backend.Entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    // "Find the row whose token_hash equals this." Optional = maybe nothing.
    // This is how we look a token up in Step 4: hash what the user sent, then search.
    Optional<PasswordResetToken> findByTokenHash(String tokenHash);

    // Kills every still-unused token of one user, in ONE database statement.
    // Used when a user asks for a new link: older links must stop working.
    //
    // @Query lets us write the query ourselves (in JPQL, which uses CLASS and FIELD
    // names like t.usedAt, not table and column names).
    // :userId and :now are placeholders, filled from the @Param arguments.
    //
    // @Modifying = "this query CHANGES data" (Spring requires this flag for update/delete).
    //   flushAutomatically = write pending changes to the DB BEFORE running this.
    //   clearAutomatically = forget cached entities AFTER running it. A bulk update
    //     bypasses JPA's memory, so without this, an entity you loaded earlier would
    //     still show the OLD usedAt value.
    //
    // Returns how many rows changed. We could loop and call markUsed() on each token,
    // but that loads every row into memory and sends one update per row. One
    // statement is faster and cannot be interrupted halfway.
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("update PasswordResetToken t set t.usedAt = :now "
            + "where t.userId = :userId and t.usedAt is null")
    int invalidateAllForUser(@Param("userId") Long userId, @Param("now") Instant now);

    // Housekeeping for Step 6: delete tokens that expired before a given moment.
    // Old tokens are useless and are a small privacy risk, so we don't keep them forever.
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("delete from PasswordResetToken t where t.expiresAt < :cutoff")
    int deleteExpiredBefore(@Param("cutoff") Instant cutoff);
}