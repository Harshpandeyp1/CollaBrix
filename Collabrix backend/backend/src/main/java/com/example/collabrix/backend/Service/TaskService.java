package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.Task.CreateTaskDto;
import com.example.collabrix.backend.Dto.Task.TaskDto;
import com.example.collabrix.backend.Dto.Task.UpdateTaskDto;
import com.example.collabrix.backend.Entity.Project;
import com.example.collabrix.backend.Entity.ProjectActivityEntity;
import com.example.collabrix.backend.Entity.TaskEntity;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Enum.InterestStatus;
import com.example.collabrix.backend.Enum.TaskStatus;
import com.example.collabrix.backend.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepo projectRepo;
    private final ProjectInterestRepo projectInterestRepo;
    private final UserRepo userRepo;
    private final ProjectActivityRepository activityRepository;


    // Get logged-in user
    private UserEntity getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }


    // Verify that the user can access the project
    private Project verifyProjectAccess(Long projectId) {

        UserEntity currentUser = getCurrentUser();

        Project project = projectRepo.findById(projectId)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));


        // Owner has automatic access
        if (project.getUser().getId()
                ==(currentUser.getId())) {

            return project;
        }


        // Check membership
        projectInterestRepo
                .findByProjectIdAndUserId(
                        projectId,
                        currentUser.getId()
                )
                .filter(interest ->
                        interest.getStatus() == InterestStatus.ACCEPTED)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.FORBIDDEN,
                                "You are not an accepted member of this project"
                        ));

        return project;
    }
    private UserEntity verifyAssignedUser(Long projectId, Long userId) {

        UserEntity assignedUser = userRepo.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Assigned user not found"
                        ));

        // Project owner can be assigned a task
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        if (project.getUser().getId()==(userId)) {
            return assignedUser;
        }

        // Otherwise, user must be an accepted member
        projectInterestRepo
                .findByProjectIdAndUserId(projectId, userId)
                .filter(interest ->
                        interest.getStatus() == InterestStatus.ACCEPTED)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "User is not an accepted member of this project"
                        ));

        return assignedUser;
    }


    // Create a task
    public TaskDto createTask(
            Long projectId,
            CreateTaskDto request) {

        UserEntity currentUser = getCurrentUser();

        Project project = verifyProjectAccess(projectId);


        // Validate title
        if (request.getTitle() == null ||
                request.getTitle().trim().isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Task title cannot be empty"
            );
        }


        // Find assigned user if provided
        UserEntity assignedUser = null;

        if (request.getAssignedTo() != null) {

            assignedUser = verifyAssignedUser(
                    projectId,
                    request.getAssignedTo()
            );
        }


        TaskEntity task = TaskEntity.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .priority(request.getPriority())
                .project(project)
                .assignedTo(assignedUser)
                .createdBy(currentUser)
                .build();


        TaskEntity savedTask =
                taskRepository.save(task);


        ProjectActivityEntity activity =
                ProjectActivityEntity.builder()
                        .project(project)
                        .user(currentUser)
                        .action("TASK_CREATED")
                        .description(
                                "Created task: "
                                        + savedTask.getTitle()
                        )
                        .build();

        activityRepository.save(activity);


        return toDto(savedTask);
    }


    // Get all tasks of a project
    public List<TaskDto> getTasks(Long projectId) {

        verifyProjectAccess(projectId);

        return taskRepository
                .findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream()
                .map(this::toDto)
                .toList();
    }


    // Convert Entity → DTO
    private TaskDto toDto(TaskEntity task) {

        UserEntity assignedTo = task.getAssignedTo();
        UserEntity createdBy = task.getCreatedBy();

        return TaskDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())

                .assignedToId(
                        assignedTo != null
                                ? assignedTo.getId()
                                : null
                )

                .assignedToUsername(
                        assignedTo != null
                                ? assignedTo.getUsername()
                                : null
                )

                .createdById(createdBy.getId())
                .createdByUsername(createdBy.getUsername())

                .createdAt(task.getCreatedAt())
                .build();
    }
    public TaskDto updateTask(
            Long taskId,
            UpdateTaskDto request) {

        UserEntity currentUser = getCurrentUser();


        TaskEntity task = taskRepository.findById(taskId)

                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Task not found"
                        ));
        TaskStatus oldStatus = task.getStatus();
        // Check whether the current user
        // can access this task's project
        verifyProjectAccess(task.getProject().getId());

        if (request.getTitle() != null &&
                !request.getTitle().trim().isEmpty()) {

            task.setTitle(request.getTitle().trim());
        }

        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }

        if (request.getAssignedTo() != null) {

            UserEntity assignedUser =
                    verifyAssignedUser(
                            task.getProject().getId(),
                            request.getAssignedTo()
                    );

            task.setAssignedTo(assignedUser);
        }

        TaskEntity updatedTask =
                taskRepository.save(task);


        if (oldStatus != TaskStatus.COMPLETED &&
                updatedTask.getStatus() == TaskStatus.COMPLETED) {

            ProjectActivityEntity activity =
                    ProjectActivityEntity.builder()
                            .project(task.getProject())
                            .user(currentUser)
                            .action("TASK_COMPLETED")
                            .description(
                                    "Completed task: "
                                            + updatedTask.getTitle()
                            )
                            .build();

            activityRepository.save(activity);
        }


        return toDto(updatedTask);
    }
    public void deleteTask(Long taskId) {

        UserEntity currentUser = getCurrentUser();

        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Task not found"
                        ));

        Project project = task.getProject();

        // Only the project owner can delete a task
        if (!(project.getUser().getId() ==(currentUser.getId()))) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only the project owner can delete tasks"
            );
        }

        taskRepository.delete(task);
    }
}