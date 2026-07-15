package com.example.collabrix.backend.Dto;
//used when new suser signs up

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @Email(message="Enter is a valid email")
    @NotBlank(message = "Email is required")
    private String Email;

    @NotBlank(message = "Password is Required")
    private String password;
}
