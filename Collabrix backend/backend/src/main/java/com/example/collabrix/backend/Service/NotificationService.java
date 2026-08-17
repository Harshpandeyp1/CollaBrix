package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Entity.NotificationEntity;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Enum.NotificationType;
import com.example.collabrix.backend.Repository.NotificationRepo;
import com.example.collabrix.backend.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepo notificationRepo;
    private final UserRepo userRepo;

    public void createNotification(
            UserEntity recipient,
            UserEntity sender,
            NotificationType type,
            String message,
            Long referenceId
    ){
        NotificationEntity notification=NotificationEntity.builder()
                .recipient(recipient)
                .sender(sender)
                .type(type)
                .message(message)
                .referenceId(referenceId)
                .isRead(false)
                .build();

        notificationRepo.save(notification);
    }
    public List<NotificationEntity> getMyNotification(
            String email
    ){
        UserEntity user=userRepo.findByEmail(email)
                .orElseThrow();
        return notificationRepo
                .findByRecipientOrderByCreatedAtDesc(user);
    }
    public List<NotificationEntity> getUnreadNotifications(
            String email
    ) {

        UserEntity user = userRepo.findByEmail(email)
                .orElseThrow();

        return notificationRepo
                .findByRecipientAndIsReadFalseOrderByCreatedAtDesc(user);
    }
    public void markAsRead(
            Long notificationId,
            String email
    ){
        UserEntity user=userRepo.findByEmail(email)
                .orElseThrow();

        NotificationEntity notification=notificationRepo.findById(notificationId).orElseThrow();

        if(!(notification.getRecipient().getId()==user.getId())){
            throw new RuntimeException("you cannot modify this notification");
        }
        notification.setRead(true);
        notificationRepo.save(notification);
    }


}
