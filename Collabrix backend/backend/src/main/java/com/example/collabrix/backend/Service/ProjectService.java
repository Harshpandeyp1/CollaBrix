package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.Project.CreateProject;
import com.example.collabrix.backend.Dto.Project.ProjectDto;
import com.example.collabrix.backend.Dto.Project.UpdateProject;
import com.example.collabrix.backend.Entity.Project;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Repository.ProjectRepo;
import com.example.collabrix.backend.Repository.UserRepo;
import com.example.collabrix.backend.exception.ResourceNotFoundException;
import com.example.collabrix.backend.mapper.ProjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepo projectRepository;

    private final ProjectMapper projectMapper;

    private final UserRepo userRepository;

    private UserEntity getCurrentUser(){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        String email=authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(()->
                        new ResourceNotFoundException("user not found"));
    }

    private Project getProjectForCurrentUser(Long id){
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("project not found"));



        return project;
    }

    public List<ProjectDto> getMyProjects(){
        UserEntity user = getCurrentUser();
        List<Project> projects = projectRepository.findByUserOrderByIdDesc(user);
        return projectMapper.toDtoList(projects);
    }

    public ProjectDto getProjectById(Long id){
        Project project = getProjectForCurrentUser(id);
        return projectMapper.toDto(project);
    }
    public List<ProjectDto> getAllProjects() {

        List<Project> projects =
                projectRepository.findAllByOrderByIdDesc();

        return projectMapper.toDtoList(projects);
    }
    @Transactional
    public ProjectDto createProject(CreateProject request) {
        UserEntity currentUser = getCurrentUser();

        Project project = projectMapper.toEntity(request);
        project.setUser(currentUser);

        Project saved = projectRepository.save(project);
        return projectMapper.toDto(saved);
    }

    @Transactional
    public ProjectDto updateProject(Long id, UpdateProject request){
        Project project = getProjectForCurrentUser(id);
        projectMapper.updateEntityFromDto(request, project);
        Project updated = projectRepository.save(project);
        return projectMapper.toDto(updated);
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = getProjectForCurrentUser(id);
        projectRepository.delete(project);
    }
}
