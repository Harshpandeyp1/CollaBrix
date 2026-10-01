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
@RequestMapping("/api/connections")
@RequiredArgsConstructor
public class ConnectionController {

    private final ConnectionService connectionService;


    // =========================================================
    // SEND CONNECTION REQUEST
    // =========================================================

    @PostMapping("/request")
    public String sendConnectionRequest(
            @RequestBody ConnectionRequestDto requestDto,
            Authentication authentication
    ) {

        String senderEmail = authentication.getName();

        connectionService.sendConnectionRequest(
                senderEmail,
                requestDto.getReceiverId()
        );

        return "Connection request sent";
    }


    // =========================================================
    // GET AVAILABLE USERS
    // =========================================================

    @GetMapping("/users")
    public List<UserEntity> getAvailableUsers(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return connectionService.getAvailableUsers(email);
    }


    // =========================================================
    // GET PENDING CONNECTION REQUESTS
    // =========================================================

    @GetMapping("/requests")
    public List<ConnectionEntity> getPendingRequests(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return connectionService.getPendingRequests(email);
    }


    // =========================================================
    // ACCEPT / REJECT CONNECTION REQUEST
    // =========================================================

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

        return "Connection request updated";
    }


    // =========================================================
    // GET MY CONNECTIONS
    // =========================================================

    @GetMapping
    public List<ConnectionEntity> getMyConnections(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return connectionService.getMyConnections(email);
    }
}