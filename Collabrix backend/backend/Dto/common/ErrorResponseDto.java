package com.example.collabrix.backend.Dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class ErrorResponseDto {
    private LocalDateTime timestamp;

    private int status;

    private String error;

    private String message;

    private String path;
}
