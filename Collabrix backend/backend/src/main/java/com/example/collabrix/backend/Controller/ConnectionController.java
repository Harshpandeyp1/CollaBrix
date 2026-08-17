package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.auth.ConnectionRequestDto;
import com.example.collabrix.backend.Entity.ConnectionEntity;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Enum.ConnectionStatus;
import com.example.collabrix.backend.Service.ConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping( "/api/connections")
@RequiredArgsConstructor
public class ConnectionController {
    private final ConnectionService connectionService;


    @PostMapping("/request")
    public String sendConnectionRequest(
            @RequestBody ConnectionRequestDto requestDto,
             Authentication authentication
    ){
        String senderEmail = authentication.getName();
        connectionService.sendConnectionRequest(
                senderEmail,
                requestDto.getReceiverId()
        );
        return "connection request sent";
    }
    @GetMapping("/users")
    public List<UserEntity> getAvailableUsers(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return connectionService.getAvailableUsers(email);
    }
    @GetMapping("/requests")
    public List<ConnectionEntity> getPendingRequests(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return connectionService.getPendingRequests(email);
    }
    @PutMapping("/{connectionId}/status")
    public String updateRequest(
            @PathVariable Long connectionId,
            @RequestParam ConnectionStatus status,
            Authentication authentication
    ) {

        String email = authentication.getName();

        connectionService.updateRequest(
                connectionId,
                status,
                email
        );

        return "connection request updated";
    }
    @GetMapping
    public List<ConnectionEntity> getMyConnections(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return connectionService.getMyConnections(email);
    }
}
