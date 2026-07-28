package com.example.collabrix.backend.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UserSuggestionDto {
    private long id;
    private String username;
    private String email;
}
