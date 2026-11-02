package com.example.collabrix.backend;

import com.example.collabrix.backend.Dto.Share.CreateShareDto;
import com.example.collabrix.backend.Dto.Share.ShareDto;
import com.example.collabrix.backend.Dto.Message.MessageResponseDto;
import com.example.collabrix.backend.Entity.ConnectionEntity;
import com.example.collabrix.backend.Entity.Post;
import com.example.collabrix.backend.Entity.Project;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Enum.ConnectionStatus;
import com.example.collabrix.backend.Enum.ShareItemType;
import com.example.collabrix.backend.Repository.ConnectionRepo;
import com.example.collabrix.backend.Repository.PostRepo;
import com.example.collabrix.backend.Repository.ProjectRepo;
import com.example.collabrix.backend.Repository.UserRepo;
import com.example.collabrix.backend.Service.ShareService;
import com.example.collabrix.backend.Service.ConnectionService;
import com.example.collabrix.backend.Service.MessageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@Transactional
class ShareServiceIntegrationTest {

    @Autowired
    private ShareService shareService;

    @Autowired
    private ConnectionService connectionService;

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PostRepo postRepo;

    @Autowired
    private ProjectRepo projectRepo;

    @Autowired
    private ConnectionRepo connectionRepo;

    @Test
    void sharesPostWithAcceptedConnectionAndMarksItSeen() {
        UserEntity sender = userRepo.save(UserEntity.builder()
                .username("sender")
                .email("sender@example.com")
                .password("password")
                .build());
        UserEntity recipient = userRepo.save(UserEntity.builder()
                .username("recipient")
                .email("recipient@example.com")
                .password("password")
                .build());
        Post post = postRepo.save(Post.builder().title("Shared post").build());
        connectionRepo.save(ConnectionEntity.builder()
                .sender(sender)
                .receiver(recipient)
                .status(ConnectionStatus.ACCEPTED)
                .build());

        assertEquals(recipient.getId(), connectionService.getMyConnections(sender.getEmail())
                .getFirst().id());

        int sharedCount = shareService.share(sender.getId(), new CreateShareDto(
                ShareItemType.POST, post.getId(), List.of(recipient.getId()), "Take a look"));

        assertEquals(1, sharedCount);
        assertEquals(1, shareService.getUnreadCount(recipient.getId()));

        ShareDto received = shareService.getReceived(recipient.getId()).getFirst();
        assertEquals(sender.getId(), received.senderId());
        assertEquals("sender", received.senderUsername());
        assertEquals("Shared post", received.itemTitle());
        assertFalse(received.seen());

        MessageResponseDto sharedPostMessage = messageService.getConversation(sender.getEmail(), recipient.getId())
                .getFirst();
        assertEquals(ShareItemType.POST, sharedPostMessage.getSharedItemType());
        assertEquals(post.getId(), sharedPostMessage.getSharedItemId());
        assertEquals("Shared post", sharedPostMessage.getSharedItemTitle());
        assertEquals("Take a look", sharedPostMessage.getSharedMessage());

        shareService.markSeen(recipient.getId(), received.id());

        assertEquals(0, shareService.getUnreadCount(recipient.getId()));
        assertTrue(shareService.getReceived(recipient.getId()).getFirst().seen());

        Project project = new Project();
        project.setTitle("Shared project");
        project.setUser(sender);
        project = projectRepo.save(project);
        Long projectId = project.getId();

        shareService.share(sender.getId(), new CreateShareDto(
                ShareItemType.PROJECT, projectId, List.of(recipient.getId()), null));

        assertTrue(messageService.getConversation(sender.getEmail(), recipient.getId()).stream()
                .anyMatch(message -> message.getSharedItemType() == ShareItemType.PROJECT
                        && message.getSharedItemId().equals(projectId)
                        && message.getSharedItemTitle().equals("Shared project")));
    }
}
