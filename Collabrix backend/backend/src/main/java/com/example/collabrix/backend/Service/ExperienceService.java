package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.experience.CreateExperience;
import com.example.collabrix.backend.Dto.experience.UpdateExperience;
import com.example.collabrix.backend.Dto.experience.experienceDto;
import com.example.collabrix.backend.Entity.Experience;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Repository.UserRepo;
import com.example.collabrix.backend.Repository.experienceRepo;
import com.example.collabrix.backend.exception.ResourceNotFoundException;
import com.example.collabrix.backend.mapper.ExperienceMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExperienceService {

    private final experienceRepo experienceRepository;
    private final ExperienceMapper experienceMapper;
    private final UserRepo userRepository;

    private UserEntity getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Experience getExperienceForCurrentUser(Long id) {
        UserEntity currentUser = getCurrentUser();

        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found"));



        return experience;
    }
  @Transactional
    public experienceDto createExperience(CreateExperience request) {
        UserEntity currentUser = getCurrentUser();

        Experience experience = experienceMapper.toEntity(request);
        experience.setUser(currentUser);

        Experience saved = experienceRepository.save(experience);
        return experienceMapper.toDto(saved);
    }

    public List<experienceDto> getMyExperiences() {
        UserEntity currentUser = getCurrentUser();
        List<Experience> experiences = experienceRepository.findByUserOrderByStartDateDesc(currentUser);
        return experienceMapper.toDtoList(experiences);
    }

    public experienceDto getExperienceById(Long id) {
        Experience experience = getExperienceForCurrentUser(id);
        return experienceMapper.toDto(experience);
    }
   @Transactional
    public experienceDto updateExperience(Long id, UpdateExperience request) {
        Experience experience = getExperienceForCurrentUser(id);

        experienceMapper.updateEntityFromDto(request, experience);

        Experience updated = experienceRepository.save(experience);
        return experienceMapper.toDto(updated);
    }
   @Transactional
    public void deleteExperience(Long id) {
        Experience experience = getExperienceForCurrentUser(id);
        experienceRepository.delete(experience);
    }
}
