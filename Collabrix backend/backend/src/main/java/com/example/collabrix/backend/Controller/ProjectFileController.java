package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.ProjectFile.ProjectFileDto;
import com.example.collabrix.backend.Service.ProjectFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/playground")
@RequiredArgsConstructor
public class ProjectFileController {

    private final ProjectFileService projectFileService;

    @PostMapping("/{projectId}/files")
    public ResponseEntity<ProjectFileDto> uploadFile(
            @PathVariable Long projectId,
            @RequestParam("file") MultipartFile file) {

        ProjectFileDto uploadedFile =
                projectFileService.uploadFile(
                        projectId,
                        file
                );

        return ResponseEntity.ok(uploadedFile);
    }

    @GetMapping("/{projectId}/files")
    public ResponseEntity<List<ProjectFileDto>> getFiles(
            @PathVariable Long projectId) {

        List<ProjectFileDto> files =
                projectFileService.getFiles(projectId);

        return ResponseEntity.ok(files);
    }
    @GetMapping("/files/{fileId}")
    public ResponseEntity<org.springframework.core.io.Resource> downloadFile(
            @PathVariable Long fileId){
        org.springframework.core.io.Resource resource =
                projectFileService.downloadFile(fileId);
        return ResponseEntity.ok()
                .body(resource);
    }
    @DeleteMapping("/files/{fileId}")
    public ResponseEntity<Void> deleteFile(
            @PathVariable Long fileId) {

        projectFileService.deleteFile(fileId);

        return ResponseEntity.noContent().build();
    }
}