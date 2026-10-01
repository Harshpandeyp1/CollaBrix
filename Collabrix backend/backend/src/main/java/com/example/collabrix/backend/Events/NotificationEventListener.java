package com.example.collabrix.backend.Events;

import com.example.collabrix.backend.Enum.NotificationType;
import com.example.collabrix.backend.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final NotificationService notificationService;

    @EventListener
    public void handleConnectionAccepted(
            ConnectionAcceptedEvent event
    ) {

        notificationService.createNotification(
                event.getRecipient().getId(),
                NotificationType.CONNECTION_ACCEPTED,
                event.getActor().getUsername()
                        + " accepted your connection request",
                event.getActor().getId()
        );
    }

    @EventListener
    public void handleConnectionRequest(
            ConnectionRequestEvent event
    ) {
        notificationService.createNotification(
                event.getRecipient().getId(),
                NotificationType.CONNECTION_REQUEST,
                event.getSender().getUsername()
                        + " sent you a connection request",
                event.getSender().getId()
        );
    }
    @EventListener
    public void handleConnectionRequestSent(ConnectionRequestSentEvent event){
        notificationService.createNotification(
                event.getRecipientUserId(),
                NotificationType.CONNECTION_REQUEST,
                "You received a new connection request",
                event.getActorUserId()
        );

    }
    @EventListener
    public void handleProjectInterestCreated(
            ProjectInterestCreatedEvent event
    ) {

        notificationService.createNotification(
                event.getRecipientUserId(),
                NotificationType.PROJECT_INTEREST,
                event.getMessage(),
                event.getProjectId()
        );
    }
@EventListener
    public void handleProjectInterestAccepted(
            ProjectInterestAcceptedEvent event
){
        notificationService.createNotification(
                event.getRecipientUserId(),
                NotificationType.PROJECT_INTEREST_ACCEPTED,
                event.getMessage(),
                event.getProjectId()
        );
}
    @EventListener
    public void handleTaskAssigned(TaskAssignedEvent event) {

        notificationService.createNotification(
                event.getRecipientUserId(),
                NotificationType.TASK_ASSIGNED,
                event.getMessage(),
                event.getTaskId()
        );
    }
}
