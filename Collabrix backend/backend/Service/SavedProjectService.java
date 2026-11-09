package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.Project.ProjectDto;
import com.example.collabrix.backend.Entity.Project;
import com.example.collabrix.backend.Entity.SavedProject;
import com.example.collabrix.backend.Repository.ProjectRepo;
import com.example.collabrix.backend.Repository.SavedProjectRepository;
import com.example.collabrix.backend.mapper.ProjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedProjectService {

    private final SavedProjectRepository savedProjectRepository;
    private final ProjectRepo projectRepository;
    private final ProjectMapper projectMapper;

    @Transactional
    public void save(Long userId, Long projectId) {
        if (savedProjectRepository.existsByUserIdAndProjectId(userId, projectId)) {
            return;
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        if (project.getUser().getId() == userId) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot save your own project");
        }

        SavedProject savedProject = new SavedProject();
        savedProject.setUserId(userId);
        savedProject.setProject(project);
        savedProjectRepository.save(savedProject);
    }

    @Transactional
    public void unsave(Long userId, Long projectId) {
        savedProjectRepository.deleteByUserIdAndProjectId(userId, projectId);
    }

    @Transactional(readOnly = true)
    public List<ProjectDto> getSavedProjects(Long userId) {
        return savedProjectRepository.findByUserIdOrderBySavedAtDesc(userId).stream()
                .map(savedProject -> projectMapper.toDto(savedProject.getProject()))
                .toList();
    }
}
