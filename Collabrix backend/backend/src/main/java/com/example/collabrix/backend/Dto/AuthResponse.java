package com.example.collabrix.backend.Dto;
//after successful login backend resoonse is send

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String message;
}
