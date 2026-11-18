package com.example.collabrix.backend.Dto.Ai;

import com.fasterxml.jackson.annotation.JsonPropertyDescription;

import java.util.List;

// The plan. Each @JsonPropertyDescription is an instruction to the model, because
// Spring AI puts these descriptions into the schema it adds to the prompt (Step 3).
public record ProjectPlanDto(

        @JsonPropertyDescription("Short project name, under 8 words")
        String projectName,

        @JsonPropertyDescription("2 to 3 sentences: the goal and who benefits")
        String summary,

        // A LIST of another record. This is nested structured output: Spring AI builds
        // a schema for the outer record AND the inner one, and parses both.
        @JsonPropertyDescription("3 to 5 milestones, in the order they should happen")
        List<Milestone> milestones
) {

    // A record declared INSIDE another record. It is only meaningful as part of a plan,
    // so it lives here. From outside you refer to it as ProjectPlanDto.Milestone.
    public record Milestone(

            @JsonPropertyDescription("Short milestone title")
            String title,

            @JsonPropertyDescription("One sentence: what is true when this milestone is done")
            String goal,

            // A list of plain strings.
            @JsonPropertyDescription("2 to 5 small concrete tasks, each starting with a verb")
            List<String> tasks
    ) {}
}