package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.Message.ConversationresponseDto;
import com.example.collabrix.backend.Dto.Message.MessageResponseDto;
import com.example.collabrix.backend.Entity.ConnectionEntity;
import com.example.collabrix.backend.Entity.MessageEntity;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Enum.ConnectionStatus;
import com.example.collabrix.backend.Repository.ConnectionRepo;
import com.example.collabrix.backend.Repository.MessageRepo;
import com.example.collabrix.backend.Repository.UserRepo;
import com.example.collabrix.backend.mapper.MessageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepo messageRepo;
    private final UserRepo userRepo;
    private final ConnectionRepo connectionRepo;
    private final MessageMapper messageMapper;


    // =========================================
    // SEND MESSAGE
    // =========================================

    public MessageResponseDto sendMessage(
            String senderEmail,
            Long receiverId,
            String content
    ) {

        UserEntity sender = userRepo.findByEmail(senderEmail)
                .orElseThrow(() ->
                        new RuntimeException("Sender not found")
                );

        UserEntity receiver = userRepo.findById(receiverId)
                .orElseThrow(() ->
                        new RuntimeException("Receiver not found")
                );


        // Check connection
        ConnectionEntity connection =
                connectionRepo.findConnectionBetweenUsers(
                        sender,
                        receiver
                ).orElseThrow(() ->
                        new RuntimeException(
                                "You are not connected with this user"
                        )
                );


        // Only accepted connections can message
        if (connection.getStatus() != ConnectionStatus.ACCEPTED) {

            throw new RuntimeException(
                    "You can message only accepted connections"
            );
        }


        // Validate message
        if (content == null || content.trim().isEmpty()) {

            throw new RuntimeException(
                    "Message cannot be empty"
            );
        }


        // Create message
        MessageEntity message = MessageEntity.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content.trim())
                .build();


        // Save message
        return messageMapper.toDto(messageRepo.save(message));
    }


    // =========================================
    // GET CONVERSATION
    // =========================================
// =========================================
// GET CONVERSATIONS
// =========================================

    public List<ConversationresponseDto> getConversations(
            String currentUserEmail
    ) {

        UserEntity currentUser = userRepo.findByEmail(currentUserEmail)
                .orElseThrow(() ->
                        new RuntimeException("Current user not found")
                );

        // Get accepted connections where current user sent the request
        List<ConnectionEntity> sent =
                connectionRepo.findBySenderAndStatus(
                        currentUser,
                        ConnectionStatus.ACCEPTED
                );

        // Get accepted connections where current user received the request
        List<ConnectionEntity> received =
                connectionRepo.findByReceiverAndStatus(
                        currentUser,
                        ConnectionStatus.ACCEPTED
                );

        // Combine both sides
        sent.addAll(received);

        return sent.stream()
                .map(connection -> {

                    UserEntity otherUser;

                    if (connection.getSender().getId()
                            ==(currentUser.getId())) {

                        otherUser = connection.getReceiver();

                    } else {

                        otherUser = connection.getSender();
                    }

                    // Get messages between current user and other user
                    List<MessageEntity> latestMessages =
                            messageRepo.findLatestConversationMessage(
                                    currentUser,
                                    otherUser
                            );

                    // First message is the newest because repository uses DESC
                    MessageEntity latestMessage =
                            latestMessages.isEmpty()
                                    ? null
                                    : latestMessages.get(0);

                    return ConversationresponseDto.builder()
                            .userId(otherUser.getId())
                            .username(otherUser.getUsername())
                            .profileImage(otherUser.getProfileImage())
                            .lastMessage(
                                    latestMessage != null
                                            ? latestMessage.getContent()
                                            : null
                            )
                            .lastMessageAt(
                                    latestMessage != null
                                            ? latestMessage.getCreatedAt()
                                            : null
                            )
                            .build();
                })
                .toList();
    }

}
