package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.Project.ProjectDiscussionMessageDto;
import com.example.collabrix.backend.Service.ProjectDiscussionMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/playground")
@RequiredArgsConstructor
public class ProjectDiscussionMessageController {

    private final ProjectDiscussionMessageService discussionService;


    @PostMapping("/{projectId}/discussion")
    public ResponseEntity<ProjectDiscussionMessageDto> sendMessage(
            @PathVariable Long projectId,
            @RequestBody Map<String, String> request) {

        String content = request.get("content");

        ProjectDiscussionMessageDto message =
                discussionService.sendMessage(
                        projectId,
                        content
                );

        return ResponseEntity.ok(message);
    }


    @GetMapping("/{projectId}/discussion")
    public ResponseEntity<List<ProjectDiscussionMessageDto>> getMessages(
            @PathVariable Long projectId) {

        List<ProjectDiscussionMessageDto> messages =
                discussionService.getMessages(projectId);

        return ResponseEntity.ok(messages);
    }
}