package com.example.collabrix.backend.Dto.Task;

import com.example.collabrix.backend.Enum.TaskPriority;
import com.example.collabrix.backend.Enum.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class TaskDto {

    private Long id;

    private String title;

    private String description;

    private TaskStatus status;

    private TaskPriority priority;

    private Long assignedToId;

    private String assignedToUsername;

    private Long createdById;

    private String createdByUsername;

    private LocalDateTime createdAt;
}