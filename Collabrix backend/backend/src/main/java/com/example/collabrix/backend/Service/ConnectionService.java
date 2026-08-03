package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Entity.ConnectionEntity;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Enum.ConnectionStatus;
import com.example.collabrix.backend.Repository.ConnectionRepo;
import com.example.collabrix.backend.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConnectionService {
    private final ConnectionRepo connectionRepo;
    private final UserRepo userRepo;

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
    }
}
