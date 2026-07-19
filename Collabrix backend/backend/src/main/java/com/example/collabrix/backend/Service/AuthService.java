package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.AuthResponse;
import com.example.collabrix.backend.Dto.LoginRequest;
import com.example.collabrix.backend.Dto.RegisterRequest;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Repository.UserRepo;
import com.example.collabrix.backend.Security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    public AuthResponse register(RegisterRequest request){

        if(userRepo.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already exists.");
        }

        if(userRepo.existsByUsername(request.getUsername())){
            throw new RuntimeException("Username already taken.");
        }

        UserEntity user = UserEntity.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepo.save(user);

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                "Registration Successful"
        );
    }
    public AuthResponse login( LoginRequest loginRequest){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
                UserEntity user=userRepo.findByEmail(loginRequest.getEmail())
                        .orElseThrow(()->
                                new RuntimeException("User not found"));
        String token =jwtService.generateToken(user.getEmail());
        return new AuthResponse(
                token,
                "login successful"
        );
    }

}
