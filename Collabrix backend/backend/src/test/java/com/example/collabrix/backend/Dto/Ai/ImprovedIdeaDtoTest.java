package com.example.collabrix.backend.Dto.Ai;

import org.junit.jupiter.api.Test;
import org.springframework.ai.converter.BeanOutputConverter;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ImprovedIdeaDtoTest {

    @Test
    void showsFormatAndParsesAReply() {

        var converter = new BeanOutputConverter<>(ImprovedIdeaDto.class);

        // 1. What Spring AI will append to your prompt
        System.out.println(converter.getFormat());

        // 2. Pretend the model replied with this text
        String fakeReply = """
                {"title": "Add a dark mode", "description": "Offers a dark theme for night use."}
                """;

        ImprovedIdeaDto dto = converter.convert(fakeReply);

        assertEquals("Add a dark mode", dto.title());
    }
}
