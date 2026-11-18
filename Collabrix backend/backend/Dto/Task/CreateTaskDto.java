package com.example.collabrix.backend.Dto.Task;

import com.example.collabrix.backend.Enum.TaskPriority;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTaskDto {

    private String title;

    private String description;

    private TaskPriority priority;

    private Long assignedTo;
}