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

        // Find sender
        UserEntity sender = userRepo.findByEmail(senderEmail)
                .orElseThrow(() ->
                        new RuntimeException("Sender not found")
                );


        // Find receiver
        UserEntity receiver = userRepo.findById(receiverId)
                .orElseThrow(() ->
                        new RuntimeException("Receiver not found")
                );


        // =========================================
        // CHECK CONNECTION
        // =========================================

        ConnectionEntity connection =
                connectionRepo.findConnectionBetweenUsers(
                        sender,
                        receiver
                ).orElseThrow(() ->
                        new RuntimeException(
                                "You are not connected with this user"
                        )
                );


        // =========================================
        // ONLY ACCEPTED CONNECTIONS CAN MESSAGE
        // =========================================

        if (connection.getStatus() != ConnectionStatus.ACCEPTED) {

            throw new RuntimeException(
                    "You can message only accepted connections"
            );
        }


        // =========================================
        // VALIDATE MESSAGE
        // =========================================

        if (content == null || content.trim().isEmpty()) {

            throw new RuntimeException(
                    "Message cannot be empty"
            );
        }


        // =========================================
        // CREATE MESSAGE
        // =========================================

        MessageEntity message = MessageEntity.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content.trim())
                .build();


        // =========================================
        // SAVE MESSAGE
        // =========================================

        MessageEntity savedMessage =
                messageRepo.save(message);


        // Convert Entity → DTO
        return messageMapper.toDto(savedMessage);
    }


    // =========================================
    // GET ALL CONVERSATIONS
    // =========================================

    public List<ConversationresponseDto> getConversations(
            String currentUserEmail
    ) {

        // =========================================
        // FIND CURRENT USER
        // =========================================

        UserEntity currentUser =
                userRepo.findByEmail(currentUserEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Current user not found"
                                )
                        );


        // =========================================
        // ACCEPTED CONNECTIONS WHERE
        // CURRENT USER IS SENDER
        // =========================================

        List<ConnectionEntity> sent =
                connectionRepo.findBySenderAndStatus(
                        currentUser,
                        ConnectionStatus.ACCEPTED
                );


        // =========================================
        // ACCEPTED CONNECTIONS WHERE
        // CURRENT USER IS RECEIVER
        // =========================================

        List<ConnectionEntity> received =
                connectionRepo.findByReceiverAndStatus(
                        currentUser,
                        ConnectionStatus.ACCEPTED
                );


        // =========================================
        // COMBINE BOTH LISTS
        // =========================================

        sent.addAll(received);


        // =========================================
        // CREATE CONVERSATION DTO
        // FOR EACH CONNECTION
        // =========================================

        return sent.stream()
                .map(connection -> {

                    UserEntity otherUser;


                    // =====================================
                    // FIND THE OTHER USER
                    // =====================================

                    if (connection.getSender().getId()
                            ==(currentUser.getId())) {

                        otherUser = connection.getReceiver();

                    } else {

                        otherUser = connection.getSender();
                    }


                    // =====================================
                    // GET LATEST MESSAGE
                    // =====================================

                    List<MessageEntity> latestMessages =
                            messageRepo.findLatestConversationMessage(
                                    currentUser,
                                    otherUser
                            );


                    MessageEntity latestMessage =
                            latestMessages.isEmpty()
                                    ? null
                                    : latestMessages.get(0);


                    // =====================================
                    // BUILD CONVERSATION DTO
                    // =====================================

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


    // =========================================
    // GET CONVERSATION WITH ONE USER
    // =========================================

    public List<MessageResponseDto> getConversation(
            String currentUserEmail,
            Long otherUserId
    ) {

        // =========================================
        // FIND CURRENT USER
        // =========================================

        UserEntity currentUser =
                userRepo.findByEmail(currentUserEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Current user not found"
                                )
                        );


        // =========================================
        // FIND OTHER USER
        // =========================================

        UserEntity otherUser =
                userRepo.findById(otherUserId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        // =========================================
        // CHECK CONNECTION
        // =========================================

        ConnectionEntity connection =
                connectionRepo.findConnectionBetweenUsers(
                        currentUser,
                        otherUser
                ).orElseThrow(() ->
                        new RuntimeException(
                                "You are not connected with this user"
                        )
                );


        // =========================================
        // ONLY ACCEPTED CONNECTIONS CAN VIEW
        // MESSAGES
        // =========================================

        if (connection.getStatus() != ConnectionStatus.ACCEPTED) {

            throw new RuntimeException(
                    "You can view messages only with accepted connections"
            );
        }


        // =========================================
        // GET ALL MESSAGES BETWEEN BOTH USERS
        // =========================================

        List<MessageEntity> messages =
                messageRepo.findConversation(
                        currentUser,
                        otherUser
                );


        // =========================================
        // ENTITY → DTO
        // =========================================

        return messageMapper.toDtoList(messages);
    }

}