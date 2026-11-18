package com.example.collabrix.backend.Dto.Task;

import com.example.collabrix.backend.Enum.TaskPriority;
import com.example.collabrix.backend.Enum.TaskStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTaskDto {

    private String title;

    private String description;

    private TaskStatus status;

    private TaskPriority priority;

    private Long assignedTo;
}