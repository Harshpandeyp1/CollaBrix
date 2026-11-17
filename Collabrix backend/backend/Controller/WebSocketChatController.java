package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.Message.ChatMessageDto;
import com.example.collabrix.backend.Dto.Message.MessageResponseDto;
import com.example.collabrix.backend.Repository.UserRepo;
import com.example.collabrix.backend.Service.MessageService;
import com.example.collabrix.backend.Entity.UserEntity;

import lombok.RequiredArgsConstructor;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class WebSocketChatController {

    private final MessageService messageService;

    private final SimpMessagingTemplate messagingTemplate;

    private final UserRepo userRepo;


    @MessageMapping("/chat")
    public void sendMessage(
            ChatMessageDto request,
            Principal principal
    ) {

        System.out.println("=================================");
        System.out.println("WEBSOCKET MESSAGE RECEIVED");
        System.out.println("PRINCIPAL = " + principal);
        System.out.println("RECEIVER ID = " + request.getReceiverId());
        System.out.println("CONTENT = " + request.getContent());
        System.out.println("=================================");

        if (principal == null) {
            throw new AccessDeniedException(
                    "WebSocket authentication is required to send messages"
            );
        }

        String senderEmail = principal.getName();

        MessageResponseDto savedMessage =
                messageService.sendMessage(
                        senderEmail,
                        request.getReceiverId(),
                        request.getContent()
                );

        UserEntity receiver =
                userRepo.findById(request.getReceiverId())
                        .orElseThrow(() ->
                                new RuntimeException("Receiver not found")
                        );

        messagingTemplate.convertAndSendToUser(
                receiver.getEmail(),
                "/queue/messages",
                savedMessage
        );
    }
}
