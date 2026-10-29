package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.Share.CreateShareDto;
import com.example.collabrix.backend.Dto.Share.ShareDto;
import com.example.collabrix.backend.Entity.*;
import com.example.collabrix.backend.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShareService {

    private final ShareRepository shareRepository;
    private final ConnectionRepo connectionRepository;
    private final IdeaRepository ideaRepository;
    private final PostRepo postRepository;
    private final ProjectRepo projectRepo;
    private final MessageRepo messageRepo;
    private final UserRepo userRepo;

    // ---------------------------------------------
    // SHARE an idea/post with several connections
    // ---------------------------------------------
    @Transactional
    public int share(Long senderId, CreateShareDto dto) {

        if (dto.itemType() == null || dto.itemId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "itemType and itemId are required");
        }
        if (dto.recipientIds() == null || dto.recipientIds().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pick at least one connection");
        }

        // 1. Does the thing being shared actually exist?
        String itemTitle = switch (dto.itemType()) {
            case IDEA -> ideaRepository.findById(dto.itemId()).map(IdeaEntity::getTitle).orElse(null);
            case POST -> postRepository.findById(dto.itemId()).map(Post::getTitle).orElse(null);
            case PROJECT -> projectRepo.findById(dto.itemId()).map(Project::getTitle).orElse(null);
        };
        if (itemTitle == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found");
        }

        // 2. Validate every recipient BEFORE saving anything
        List<Share> shares = new ArrayList<>();
        List<MessageEntity> chatMessages = new ArrayList<>();
        UserEntity sender = userRepo.findById(senderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sender not found"));

        for (Long recipientId : dto.recipientIds().stream().distinct().toList()) {

            if (recipientId == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Recipient IDs cannot be null");
            }

            if (recipientId.equals(senderId)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You can't share with yourself");
            }

            if (!connectionRepository.areConnected(senderId, recipientId)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only share with your connections");
            }

            UserEntity recipient = userRepo.findById(recipientId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipient not found"));

            Share share = new Share();
            share.setSenderId(senderId);
            share.setRecipientId(recipientId);
            share.setItemType(dto.itemType());
            share.setItemId(dto.itemId());
            share.setMessage(dto.message());
            shares.add(share);

            chatMessages.add(MessageEntity.builder()
                    .sender(sender)
                    .receiver(recipient)
                    .content(dto.message() == null || dto.message().isBlank()
                            ? "Shared " + dto.itemType().name().toLowerCase() + ": " + itemTitle
                            : dto.message().trim())
                    .sharedItemType(dto.itemType())
                    .sharedItemId(dto.itemId())
                    .sharedItemTitle(itemTitle)
                    .sharedMessage(dto.message())
                    .build());
        }

        // 3. Save all at once
        shareRepository.saveAll(shares);
        messageRepo.saveAll(chatMessages);

        return shares.size();
    }

    // ---------------------------------------------
    // INBOX: everything shared with me
    // ---------------------------------------------
    @Transactional(readOnly = true)
    public List<ShareDto> getReceived(Long userId) {
        return shareRepository.findByRecipientIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return shareRepository.countByRecipientIdAndSeenFalse(userId);
    }

    // ---------------------------------------------
    // MARK AS SEEN
    // ---------------------------------------------
    @Transactional
    public void markSeen(Long userId, Long shareId) {

        Share share = shareRepository.findById(shareId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Share not found"));

        // only the recipient may mark their own share as seen
        if (!share.getRecipientId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your share");
        }

        share.setSeen(true);   // no save() needed, see the notes below
    }

    // ---------------------------------------------
    // Entity -> DTO
    // ---------------------------------------------
    private ShareDto toDto(Share s) {

        String senderName = userRepo.findById(s.getSenderId())
                .map(UserEntity::getUsername)
                .orElse("Unknown");

        String title = switch (s.getItemType()) {
            case IDEA -> ideaRepository.findById(s.getItemId())
                    .map(IdeaEntity::getTitle).orElse("[deleted idea]");
            case POST -> postRepository.findById(s.getItemId())
                    .map(Post::getTitle).orElse("[deleted post]");
            case PROJECT -> projectRepo.findById(s.getItemId())
                    .map(Project::getTitle).orElse("[deleted project]");
        };

        return new ShareDto(
                s.getId(), s.getSenderId(), senderName,
                s.getItemType(), s.getItemId(), title,
                s.getMessage(), s.getCreatedAt(), s.isSeen()
        );
    }
}
