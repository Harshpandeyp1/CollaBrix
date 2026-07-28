package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.ConnectionRequestDto;
import com.example.collabrix.backend.Service.ConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/connections", "/api/connections"})
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
}
