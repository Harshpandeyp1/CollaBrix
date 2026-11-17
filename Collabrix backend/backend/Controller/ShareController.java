package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.Share.CreateShareDto;
import com.example.collabrix.backend.Dto.Share.ShareDto;
import com.example.collabrix.backend.Repository.UserRepo;
import com.example.collabrix.backend.Service.ShareService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shares")
@RequiredArgsConstructor
public class ShareController {

    private final ShareService shareService;
    private final UserRepo userRepo;

    @PostMapping
    public ResponseEntity<Map<String, Integer>> share(@RequestBody CreateShareDto request,
                                                      Authentication auth) {
        int count = shareService.share(currentUserId(auth), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("sharedCount", count));
    }

    @GetMapping("/received")
    public ResponseEntity<List<ShareDto>> getReceived(Authentication auth) {
        return ResponseEntity.ok(shareService.getReceived(currentUserId(auth)));
    }

    @GetMapping("/received/unread-count")
    public ResponseEntity<Map<String, Long>> unreadCount(Authentication auth) {
        return ResponseEntity.ok(Map.of("count", shareService.getUnreadCount(currentUserId(auth))));
    }

    @PatchMapping("/{shareId}/seen")
    public ResponseEntity<Void> markSeen(@PathVariable Long shareId, Authentication auth) {
        shareService.markSeen(currentUserId(auth), shareId);
        return ResponseEntity.noContent().build();
    }

    private Long currentUserId(Authentication auth) {
        return userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Authenticated user not found"))
                .getId();
    }
}