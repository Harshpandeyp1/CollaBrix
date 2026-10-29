package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.Notification.NotificationResponseDto;
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


    // =========================================================
    // CREATE NOTIFICATION
    // =========================================================

    public NotificationEntity createNotification(
            Long recipientUserId,
            NotificationType type,
            String message,
            Long referenceId
    ) {

        UserEntity recipient = userRepo.findById(recipientUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        NotificationEntity notification =
                NotificationEntity.builder()
                        .recipient(recipient)
                        .type(type)
                        .message(message)
                        .referenceId(referenceId)
                        .isRead(false)
                        .build();

        return notificationRepo.save(notification);
    }


    // =========================================================
    // GET ALL NOTIFICATIONS
    // =========================================================

    public List<NotificationResponseDto> getNotifications(
            String userEmail
    ) {

        System.out.println(
                "NOTIFICATION REQUEST USER EMAIL = "
                        + userEmail
        );

        UserEntity user =
                userRepo.findByEmail(userEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        System.out.println(
                "NOTIFICATION REQUEST USER ID = "
                        + user.getId()
        );

        List<NotificationEntity> notifications =
                notificationRepo
                        .findByRecipientOrderByCreatedAtDesc(
                                user
                        );

        System.out.println(
                "NOTIFICATIONS FOUND = "
                        + notifications.size()
        );

        return notifications.stream()
                .map(notification ->
                        NotificationResponseDto.builder()
                                .id(notification.getId())
                                .type(notification.getType())
                                .message(notification.getMessage())
                                .referenceId(notification.getReferenceId())
                                .read(notification.isRead())
                                .createdAt(notification.getCreatedAt())
                                .build()
                )
                .toList();
    }


    // =========================================================
    // GET UNREAD NOTIFICATIONS
    // =========================================================

    public List<NotificationResponseDto> getUnreadNotifications(
            String userEmail
    ) {

        UserEntity user =
                userRepo.findByEmail(userEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );
        return notificationRepo
                .findByRecipientAndIsReadFalseOrderByCreatedAtDesc(user)
                .stream()
                .map(notification ->
                        NotificationResponseDto.builder()
                                .id(notification.getId())
                                .type(notification.getType())
                                .message(notification.getMessage())
                                .referenceId(notification.getReferenceId())
                                .read(notification.isRead())
                                .createdAt(notification.getCreatedAt())
                                .build()
                )
                .toList();
    }


    // =========================================================
    // MARK NOTIFICATION AS READ
    // =========================================================

    public NotificationEntity markAsRead(
            String userEmail,
            Long notificationId
    ) {

        UserEntity user =
                userRepo.findByEmail(userEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        NotificationEntity notification =
                notificationRepo.findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                )
                        );

        // Make sure the notification belongs
        // to the currently logged-in user
        if (!(notification.getRecipient()
                .getId()
                ==(user.getId()))) {

            throw new RuntimeException(
                    "You are not allowed to modify this notification"
            );
        }

        notification.setRead(true);

        return notificationRepo.save(notification);
    }


    // =========================================================
    // MARK ALL NOTIFICATIONS AS READ
    // =========================================================

    public void markAllAsRead(
            String userEmail
    ) {

        UserEntity user =
                userRepo.findByEmail(userEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        List<NotificationEntity> notifications =
                notificationRepo
                        .findByRecipientOrderByCreatedAtDesc(
                                user
                        );

        notifications.forEach(notification ->
                notification.setRead(true)
        );

        notificationRepo.saveAll(notifications);
    }
}
