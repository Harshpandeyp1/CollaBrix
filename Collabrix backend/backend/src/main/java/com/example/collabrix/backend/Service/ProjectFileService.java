package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.ProjectFile.ProjectFileDto;
import com.example.collabrix.backend.Entity.*;
import com.example.collabrix.backend.Enum.InterestStatus;
import com.example.collabrix.backend.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectFileService {

    private final ProjectFileRepository fileRepository;
    private final ProjectRepo projectRepo;
    private final ProjectInterestRepo projectInterestRepo;
    private final UserRepo userRepo;
    private final ProjectActivityRepository activityRepository;

    private final Path uploadDirectory =
            Paths.get("uploads/projects");


    private UserEntity getCurrentUser() {

        var authentication =
                org.springframework.security.core.context
                        .SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }


    private Project verifyProjectAccess(Long projectId) {

        UserEntity currentUser = getCurrentUser();

        Project project =
                projectRepo.findById(projectId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Project not found"
                                ));


        // Project owner
        if (project.getUser().getId()
                ==(currentUser.getId())) {

            return project;
        }


        // Check membership
        ProjectInterest interest =
                projectInterestRepo
                        .findByProjectIdAndUserId(
                                projectId,
                                currentUser.getId()
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "You are not a member of this project"
                                ));


        // Only accepted members
        if (interest.getStatus()
                != InterestStatus.ACCEPTED) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not an accepted member of this project"
            );
        }

        return project;
    }


    public ProjectFileDto uploadFile(
            Long projectId,
            MultipartFile file) {

        UserEntity currentUser = getCurrentUser();

        Project project =
                verifyProjectAccess(projectId);


        if (file == null || file.isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "File cannot be empty"
            );
        }


        try {

            Path projectDirectory =
                    uploadDirectory.resolve(
                            String.valueOf(projectId)
                    );

            Files.createDirectories(projectDirectory);


            String originalFileName =
                    file.getOriginalFilename();

            String storedFileName =
                    UUID.randomUUID()
                            + "_"
                            + originalFileName;


            Path filePath =
                    projectDirectory.resolve(
                            storedFileName
                    );


            Files.copy(
                    file.getInputStream(),
                    filePath
            );


            ProjectFileEntity projectFile =
                    ProjectFileEntity.builder()
                            .fileName(originalFileName)
                            .fileUrl(
                                    "/uploads/projects/"
                                            + projectId
                                            + "/"
                                            + storedFileName
                            )
                            .fileType(file.getContentType())
                            .fileSize(file.getSize())
                            .project(project)
                            .uploadedBy(currentUser)
                            .build();


            ProjectFileEntity saved =
                    fileRepository.save(projectFile);

            ProjectActivityEntity activity =
                    ProjectActivityEntity.builder()
                            .project(project)
                            .user(currentUser)
                            .action("FILE_UPLOADED")
                            .description(
                                    "Uploaded file: "
                                            + saved.getFileName()
                            )
                            .build();

            activityRepository.save(activity);

            return toDto(saved);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to upload file",
                    e
            );
        }
    }


    public List<ProjectFileDto> getFiles(
            Long projectId) {

        verifyProjectAccess(projectId);

        return fileRepository
                .findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream()
                .map(this::toDto)
                .toList();
    }


    private ProjectFileDto toDto(
            ProjectFileEntity file) {

        UserEntity uploader =
                file.getUploadedBy();

        return ProjectFileDto.builder()
                .id(file.getId())
                .fileName(file.getFileName())
                .fileUrl(file.getFileUrl())
                .fileType(file.getFileType())
                .fileSize(file.getFileSize())
                .uploadedById(uploader.getId())
                .uploadedByUsername(
                        uploader.getUsername()
                )
                .uploadedByProfileImage(
                        uploader.getProfileImage()
                )
                .createdAt(file.getCreatedAt())
                .build();
    }
    public org.springframework.core.io.Resource downloadFile(Long fileId) {

        ProjectFileEntity file =
                fileRepository.findById(fileId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "File not found"
                                ));

        // Check whether the logged-in user belongs to the project
        verifyProjectAccess(file.getProject().getId());

        try {

            Path filePath =
                    Paths.get(file.getFileUrl().substring(1));

            org.springframework.core.io.Resource resource =
                    new org.springframework.core.io.UrlResource(
                            filePath.toUri()
                    );

            if (!resource.exists() || !resource.isReadable()) {

                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "File not found on server"
                );
            }

            return resource;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to read file",
                    e
            );
        }
    }
    public void deleteFile(Long fileId) {

        UserEntity currentUser = getCurrentUser();

        ProjectFileEntity file =
                fileRepository.findById(fileId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "File not found"
                                ));

        Project project = file.getProject();

        // Check project access
        verifyProjectAccess(project.getId());

        // Only project owner or uploader can delete
        boolean isOwner =
                project.getUser().getId()
                        ==(currentUser.getId());

        boolean isUploader =
                file.getUploadedBy().getId()
                        ==(currentUser.getId());

        if (!isOwner && !isUploader) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You do not have permission to delete this file"
            );
        }

        try {

            Path filePath =
                    Paths.get(file.getFileUrl().substring(1));

            Files.deleteIfExists(filePath);

            fileRepository.delete(file);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to delete file",
                    e
            );
        }
    }
}