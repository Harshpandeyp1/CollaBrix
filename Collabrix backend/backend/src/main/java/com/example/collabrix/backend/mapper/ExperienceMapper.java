package com.example.collabrix.backend.mapper;

import com.example.collabrix.backend.Dto.experience.CreateExperience;
import com.example.collabrix.backend.Dto.experience.UpdateExperience;
import com.example.collabrix.backend.Dto.experience.experienceDto;
import com.example.collabrix.backend.Entity.Experience;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ExperienceMapper {

    // ------------------------------------------------------
    // Entity -> DTO
    // What React receives.
    // ------------------------------------------------------
    public experienceDto toDto(Experience experience) {
        if (experience == null) {
            return null;
        }

        experienceDto dto = new experienceDto();
        dto.setId(experience.getId());
        dto.setCompany(experience.getCompany());
        dto.setPosition(experience.getPosition());
        dto.setEmploymentType(experience.getEmploymentType());
        dto.setLocation(experience.getLocation());
        dto.setDescription(experience.getDescription());
        dto.setStartDate(experience.getStartDate());
        dto.setEndDate(experience.getEndDate());
        dto.setCurrentlyWorking(experience.isCurrentlyWorking());

        return dto;
    }

    public List<experienceDto> toDtoList(List<Experience> experiences) {
        if (experiences == null) {
            return null;
        }

        return experiences.stream()
                .map(this::toDto)
                .toList();
    }

    // ------------------------------------------------------
    // CreateExperience -> Entity
    // Note: user is NOT set here. The service layer resolves
    // the logged-in user from the JWT and sets it separately
    // (experience.setUser(user)) before saving.
    // ------------------------------------------------------
    public Experience toEntity(CreateExperience request) {
        if (request == null) {
            return null;
        }

        Experience experience = new Experience();
        experience.setCompany(request.getCompany());
        experience.setPosition(request.getPosition());
        experience.setEmploymentType(request.getEmploymentType());
        experience.setLocation(request.getLocation());
        experience.setDescription(request.getDescription());
        experience.setStartDate(request.getStartDate());
        experience.setEndDate(request.getEndDate());
        experience.setCurrentlyWorking(request.isCurrentlyWorking());

        return experience;
    }

    // ------------------------------------------------------
    // UpdateExperience -> mutate existing Entity
    // id and user are intentionally left untouched here.
    // ------------------------------------------------------
    public void updateEntityFromDto(UpdateExperience update, Experience experience) {
        if (experience == null || update == null) {
            return;
        }

        experience.setCompany(update.getCompany());
        experience.setPosition(update.getPosition());
        experience.setEmploymentType(update.getEmploymentType());
        experience.setLocation(update.getLocation());
        experience.setDescription(update.getDescription());
        experience.setStartDate(update.getStartDate());
        experience.setEndDate(update.getEndDate());
        experience.setCurrentlyWorking(update.isCurrentlyWorking());
    }
}
