package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.common.ApiResponse;
import com.example.collabrix.backend.Dto.experience.CreateExperience;
import com.example.collabrix.backend.Dto.experience.UpdateExperience;
import com.example.collabrix.backend.Dto.experience.experienceDto;
import com.example.collabrix.backend.Service.ExperienceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experiences")
@RequiredArgsConstructor
public class ExperienceController {
   private final ExperienceService experienceService;

   @PostMapping("")
    public ResponseEntity<ApiResponse<experienceDto>>createExperience(
           @Valid @RequestBody CreateExperience request
           ){
      experienceDto createExperience=experienceService.createExperience(request);
       ApiResponse<experienceDto> response = new ApiResponse<>(
               true,
               "Experience created successfully",
               createExperience
       );
       // Adjust constructor args to match your actual ApiResponse shape (success flag, message, data, etc.)

       return ResponseEntity.status(HttpStatus.CREATED).body(response);
   }

    @GetMapping
    public ResponseEntity<ApiResponse<List<experienceDto>>> getMyExperiences() {
        List<experienceDto> experiences = experienceService.getMyExperiences();

        ApiResponse<List<experienceDto>> response = new ApiResponse<>(
                true,
                "Experiences fetched successfully",
                experiences
        );

        return ResponseEntity.ok(response);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<experienceDto>> getExperienceById(
            @PathVariable Long id
    ) {
        experienceDto experience = experienceService.getExperienceById(id);

        ApiResponse<experienceDto> response = new ApiResponse<>(
                true,
                "Experience fetched successfully",
                experience
        );

        return ResponseEntity.ok(response);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<experienceDto>> updateExperience(
            @PathVariable Long id,
            @Valid @RequestBody UpdateExperience request
    ) {
        experienceDto updatedExperience = experienceService.updateExperience(id, request);

        ApiResponse<experienceDto> response = new ApiResponse<>(
                true,
                "Experience updated successfully",
                updatedExperience
        );

        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExperience(
            @PathVariable Long id
    ) {
        experienceService.deleteExperience(id);

        ApiResponse<Void> response = new ApiResponse<>(
                true,
                "Experience deleted successfully",
                null
        );

        return ResponseEntity.ok(response);
    }
}
