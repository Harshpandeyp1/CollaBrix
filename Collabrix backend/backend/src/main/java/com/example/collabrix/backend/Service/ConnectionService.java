package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Entity.ConnectionEntity;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Dto.connection.ConnectionUserDto;
import com.example.collabrix.backend.Enum.ConnectionStatus;
import com.example.collabrix.backend.Events.ConnectionAcceptedEvent;
import com.example.collabrix.backend.Events.ConnectionRequestEvent;
import com.example.collabrix.backend.Events.ConnectionRequestSentEvent;
import com.example.collabrix.backend.Repository.ConnectionRepo;
import com.example.collabrix.backend.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ConnectionService {

    private final ConnectionRepo connectionRepo;
    private final UserRepo userRepo;
    private final ApplicationEventPublisher eventPublisher;


    // =========================================================
    // SEND CONNECTION REQUEST
    // =========================================================

    public void sendConnectionRequest(
            String senderEmail,
            Long receiverId
    ) {

        UserEntity sender =
                userRepo.findByEmail(senderEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Sender not found"
                                )
                        );

        UserEntity receiver =
                userRepo.findById(receiverId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Receiver not found"
                                )
                        );


        // Cannot send request to yourself
        if (sender.getId()==(receiver.getId())) {

            throw new RuntimeException(
                    "You cannot send a connection request to yourself"
            );
        }


        // Check whether connection already exists
        if (connectionRepo
                .findConnectionBetweenUsers(
                        sender,
                        receiver
                )
                .isPresent()) {

            throw new RuntimeException(
                    "Connection already exists"
            );
        }


        ConnectionEntity connection =
                ConnectionEntity.builder()
                        .sender(sender)
                        .receiver(receiver)
                        .status(ConnectionStatus.PENDING)
                        .build();


        connectionRepo.save(connection);

        eventPublisher.publishEvent(
                new ConnectionRequestSentEvent(
                        receiver.getId(),
                        sender.getId()
                )

        );
    }


    // =========================================================
    // GET AVAILABLE USERS
    // =========================================================

    public List<UserEntity> getAvailableUsers(
            String email
    ) {

        UserEntity currentUser =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        return userRepo.findAll()
                .stream()
                .filter(user ->
                        !(user.getId() ==(
                                currentUser.getId()
                        ))
                )
                .toList();
    }


    // =========================================================
    // GET PENDING REQUESTS
    // =========================================================

    public List<ConnectionEntity> getPendingRequests(
            String email
    ) {

        UserEntity currentUser =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        return connectionRepo
                .findByReceiverAndStatus(
                        currentUser,
                        ConnectionStatus.PENDING
                );
    }


    // =========================================================
    // ACCEPT / REJECT REQUEST
    // =========================================================

    public void updateRequest(
            Long connectionId,
            ConnectionStatus status,
            String currentUserEmail
    ) {

        UserEntity currentUser =
                userRepo.findByEmail(currentUserEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        ConnectionEntity connection =
                connectionRepo.findById(connectionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Connection request not found"
                                )
                        );


        // Only the receiver can accept/reject
        if (!(connection.getReceiver()
                .getId()
                ==(currentUser.getId()))) {

            throw new RuntimeException(
                    "You are not allowed to modify this request"
            );
        }


        // Request must still be pending
        if (connection.getStatus()
                != ConnectionStatus.PENDING) {

            throw new RuntimeException(
                    "Connection request is not pending"
            );
        }


        connection.setStatus(status);

        connectionRepo.save(connection);


        // =====================================================
        // EVENT-DRIVEN NOTIFICATION
        // =====================================================

        if (status == ConnectionStatus.ACCEPTED) {

            eventPublisher.publishEvent(
                    new ConnectionAcceptedEvent(
                            connection.getSender(),
                            connection.getReceiver()
                    )
            );
        }
    }


    // =========================================================
    // GET MY CONNECTIONS
    // =========================================================

    public List<ConnectionUserDto> getMyConnections(
            String email
    ) {

        UserEntity currentUser =
                userRepo.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        return Stream.concat(
                        connectionRepo.findBySenderAndStatus(currentUser, ConnectionStatus.ACCEPTED)
                                .stream()
                                .map(ConnectionEntity::getReceiver),
                        connectionRepo.findByReceiverAndStatus(currentUser, ConnectionStatus.ACCEPTED)
                                .stream()
                                .map(ConnectionEntity::getSender)
                )
                .map(user -> new ConnectionUserDto(
                        user.getId(), user.getUsername(), user.getFullName(), user.getProfileImage()))
                .toList();
    }
}
