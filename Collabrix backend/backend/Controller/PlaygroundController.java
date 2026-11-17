package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.Playground.PlaygroundAccessDto;
import com.example.collabrix.backend.Dto.Playground.PlaygroundDetailDto;
import com.example.collabrix.backend.Service.PlaygroundService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playground")
@RequiredArgsConstructor
public class PlaygroundController {

    private final PlaygroundService playgroundService;

    // Get details of one accessible Playground
    @GetMapping("/{projectId}")
    public ResponseEntity<PlaygroundDetailDto> getPlayground(
            @PathVariable Long projectId
    ) {

        PlaygroundDetailDto playground =
                playgroundService.getAccessibleProject(projectId);

        return ResponseEntity.ok(playground);
    }

    // Get all Playgrounds accessible to current user
    @GetMapping
    public ResponseEntity<List<PlaygroundAccessDto>> getMyPlaygrounds() {

        List<PlaygroundAccessDto> playgrounds =
                playgroundService.getMyPlaygrounds();

        return ResponseEntity.ok(playgrounds);
    }
}