package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.Task.CreateTaskDto;
import com.example.collabrix.backend.Dto.Task.TaskDto;
import com.example.collabrix.backend.Dto.Task.UpdateTaskDto;
import com.example.collabrix.backend.Service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playground")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping("/{projectId}/tasks")
    public ResponseEntity<TaskDto> createTask(
            @PathVariable Long projectId,
            @RequestBody CreateTaskDto request) {

        TaskDto task =
                taskService.createTask(projectId, request);

        return ResponseEntity.ok(task);
    }

    @GetMapping("/{projectId}/tasks")
    public ResponseEntity<List<TaskDto>> getTasks(
            @PathVariable Long projectId) {

        List<TaskDto> tasks =
                taskService.getTasks(projectId);

        return ResponseEntity.ok(tasks);
    }
    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<TaskDto> updateTask(
            @PathVariable Long taskId,
            @RequestBody UpdateTaskDto request) {

        TaskDto updatedTask =
                taskService.updateTask(taskId, request);

        return ResponseEntity.ok(updatedTask);
    }
    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long taskId) {

        taskService.deleteTask(taskId);

        return ResponseEntity.noContent().build();
    }
}