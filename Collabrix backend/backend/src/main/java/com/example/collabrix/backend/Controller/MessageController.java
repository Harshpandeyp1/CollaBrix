package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.Message.MessageResponseDto;
import com.example.collabrix.backend.Dto.Message.SendMessageDto;
import com.example.collabrix.backend.Service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    // =========================================
    // SEND MESSAGE
    // =========================================

    @PostMapping
    public MessageResponseDto sendMessage(
            @RequestBody SendMessageDto request,
            Authentication authentication
    ) {

        String senderEmail = authentication.getName();

        return messageService.sendMessage(
                senderEmail,
                request.getReceiverId(),
                request.getContent()
        );
    }

    // =========================================
    // GET CONVERSATION
    // =========================================

    @GetMapping("/{userId}")
    public List<MessageResponseDto> getConversation(
            @PathVariable Long userId,
            Authentication authentication
    ) {

        String currentUserEmail = authentication.getName();

        return messageService.getConversation(
                currentUserEmail,
                userId
        );
    }
}