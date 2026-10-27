package com.example.collabrix.backend.Dto.connection;

/** A safe view of the other user in an accepted connection. */
public record ConnectionUserDto(
        Long id,
        String username,
        String fullName,
        String profileImage
) {
}
