package com.example.collabrix.backend.Dto.Ai;

import com.fasterxml.jackson.annotation.JsonPropertyDescription;

public record ImprovedIdeaDto(

        @JsonPropertyDescription("A specific title, under 10 words, no clickbait")
        String title,

        @JsonPropertyDescription("2 to 4 sentences: what the idea is, why it helps, one first step")
        String description
) {};