package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.AuthResponse;
import com.example.collabrix.backend.Dto.RegisterRequest;
import com.example.collabrix.backend.Repository.UserRepo;
import com.example.collabrix.backend.Security.JwtService;
import org.springframework.security.core.userdetails.User;

public class AuthService {
    public AuthResponse register(RegisterRequest request){

        if(UserRepo.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already exists.");
        }

        if(UserRepo.existsByUsername(request.getUsername())){
            throw new RuntimeException("Username already taken.");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        UserRepo.save(user);

        String token = JwtService.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                "Registration Successful"
        );
    }

}
