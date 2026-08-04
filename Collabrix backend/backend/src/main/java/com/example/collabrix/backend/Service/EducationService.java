package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.Education.CreateEducation;
import com.example.collabrix.backend.Dto.Education.EducationDto;
import com.example.collabrix.backend.Dto.Education.UpdateEducation;
import com.example.collabrix.backend.Entity.Education;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Repository.UserRepo;
import com.example.collabrix.backend.Repository.educationRepo;
import com.example.collabrix.backend.exception.ResourceNotFoundException;
import com.example.collabrix.backend.mapper.EducationMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class EducationService {
    private final educationRepo educationRepository;

    private final EducationMapper educationMapper;

    private final UserRepo userRepository;

    private UserEntity getCurrentUser() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    private Education getEducationForCurrentUser(Long id) {

        UserEntity currentUser = getCurrentUser();

        Education education = educationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Education not found"));



        return education;
    }

    @Transactional
    public EducationDto createEducation(CreateEducation request) {

        UserEntity currentUser = getCurrentUser();

        Education education = educationMapper.toEntity(request);

        education.setUser(currentUser);

        Education saved = educationRepository.save(education);

        return educationMapper.toDto(saved);
    }
    public List<EducationDto> getMyEducation(){
        UserEntity curruser = getCurrentUser();
        List<Education> educations = educationRepository.findByUserOrderByStartDateDesc(curruser);
        return educationMapper.toDtoList(educations);
    }

    public EducationDto getEducationById(Long id){
        Education education = getEducationForCurrentUser(id);
        return educationMapper.toDto(education);
    }

    @Transactional
    public EducationDto updateEducation(Long id, UpdateEducation request){
        Education education = getEducationForCurrentUser(id);
        educationMapper.updateEntityFromDto(request, education);
        Education updated = educationRepository.save(education);
        return educationMapper.toDto(updated);
    }

    @Transactional
    public void deleteEducation(Long id){
        Education education = getEducationForCurrentUser(id);
        educationRepository.delete(education);
    }
}
