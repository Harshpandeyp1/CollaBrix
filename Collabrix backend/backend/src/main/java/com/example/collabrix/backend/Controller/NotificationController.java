package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Entity.NotificationEntity;
import com.example.collabrix.backend.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/notifications", "/api/notifications"})
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    public List<NotificationEntity>getMyNotification(
            Authentication authentication
    ){
        String email=authentication.getName();
        return notificationService.getMyNotification(email);
    }
    // Get unread notifications
    @GetMapping("/unread")
    public List<NotificationEntity> getUnreadNotifications(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return notificationService.getUnreadNotifications(email);
    }
    @PutMapping("/{notificationId}/read")
    public String markAsRead(
            @PathVariable Long notificationId,
            Authentication authentication
    ) {

        String email = authentication.getName();

        notificationService.markAsRead(
                notificationId,
                email
        );

        return "notification marked as read";
    }
}
