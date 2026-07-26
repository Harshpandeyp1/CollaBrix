package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.AuthResponse;
import com.example.collabrix.backend.Dto.LoginRequest;
import com.example.collabrix.backend.Dto.RegisterRequest;
import com.example.collabrix.backend.Service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping({"/auth", "/api/auth"})
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse>register(
            @Valid @RequestBody RegisterRequest request
            ){
        return ResponseEntity.ok(
                authService.register(request)
        );
    }
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(
                authService.login(request)
        );
    }
}
