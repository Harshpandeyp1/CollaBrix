package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.config.AiProperties;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiPingController {
    private final ChatClient chatClient;
    private final AiProperties props;
    public AiPingController(ChatClient.Builder builder, AiProperties props) {
        this.chatClient = builder.build();
        this.props = props;
    }

    @GetMapping("/ping")
    public Map<String, String> ping() {
        String reply = chatClient.prompt()
                .user("Reply with exactly one word: pong")
                .call()
                .content();

        return Map.of("reply", reply);
    }



    @GetMapping("/props")
    public AiProperties props() {
        return props;
    }

}
