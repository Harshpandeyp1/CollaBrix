package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Entity.ConnectionEntity;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Enum.ConnectionStatus;
import com.example.collabrix.backend.Enum.NotificationType;
import com.example.collabrix.backend.Repository.ConnectionRepo;
import com.example.collabrix.backend.Repository.NotificationRepo;
import com.example.collabrix.backend.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConnectionService {
    private final ConnectionRepo connectionRepo;
    private final UserRepo userRepo;
    private final NotificationRepo notificationRepo;
    private final NotificationService notificationService;

    public void sendConnectionRequest(String senderEmail, Long receiverId) {
        UserEntity sender = userRepo.findByEmail(senderEmail)
                .orElseThrow();
        UserEntity receiver = userRepo.findById(receiverId)
                .orElseThrow();

        if (sender.getId() == receiver.getId()) {
            throw new RuntimeException("you cannot connect with yourself");
        }
        if (connectionRepo.findBySenderAndReceiver(sender, receiver).isPresent()) {
            throw new RuntimeException("Connection request already exist");
        }

        ConnectionEntity connection = ConnectionEntity.builder()
                .sender(sender)
                .receiver(receiver)
                .status(ConnectionStatus.PENDING)
                .build();

        connectionRepo.save(connection);

        notificationService.createNotification(
                receiver,
                sender,
                NotificationType.CONNECTION_REQUEST,
                sender.getUsername() + " sent you a connection request",
                connection.getId()
        );
    }
    public List<UserEntity> getAvailableUsers(String email) {

        UserEntity currentUser = userRepo.findByEmail(email)
                .orElseThrow();

        return userRepo.findAllByIdNot(currentUser.getId());
    }
    public List<ConnectionEntity> getPendingRequests(String email) {

        UserEntity currentUser = userRepo.findByEmail(email)
                .orElseThrow();

        return connectionRepo.findByReceiverAndStatus(
                currentUser,
                ConnectionStatus.PENDING
        );
    }
    public void updateRequest(
            Long connectionId,
            ConnectionStatus status,
            String email
    ){
        UserEntity currUser=userRepo.findByEmail(email)
                .orElseThrow();
        ConnectionEntity connection=connectionRepo.findById(connectionId)
                .orElseThrow();

        if (connection.getReceiver().getId() != currUser.getId()) {
            throw new RuntimeException("only receiver can update this request");
        }

        connection.setStatus(status);

        connectionRepo.save(connection);
    }
    public List<ConnectionEntity> getMyConnections(String email) {

        UserEntity currentUser = userRepo.findByEmail(email)
                .orElseThrow();

        List<ConnectionEntity> sent =
                connectionRepo.findBySenderAndStatus(
                        currentUser,
                        ConnectionStatus.ACCEPTED
                );

        List<ConnectionEntity> received =
                connectionRepo.findByReceiverAndStatus(
                        currentUser,
                        ConnectionStatus.ACCEPTED
                );

        sent.addAll(received);

        return sent;
    }
}
