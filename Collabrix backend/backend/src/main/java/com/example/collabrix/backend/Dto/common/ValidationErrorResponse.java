package com.example.collabrix.backend.Dto.common;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Builder
public class ValidationErrorResponse {

    private LocalDateTime timestamp;

    private int status;

    private String error;

    private String path;

    private Map<String, String> errors;
}