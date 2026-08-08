package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.Education.CreateEducation;
import com.example.collabrix.backend.Dto.Education.EducationDto;
import com.example.collabrix.backend.Dto.Education.UpdateEducation;
import com.example.collabrix.backend.Dto.common.ApiResponse;
import com.example.collabrix.backend.Service.EducationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/education")
@RequiredArgsConstructor
public class EducationalController {
    private final EducationService educationService;

    @PostMapping
    public ResponseEntity<ApiResponse<EducationDto>> createEducation(
            @Valid @RequestBody CreateEducation request
    ){
        EducationDto createEducation = educationService.createEducation(request);
        ApiResponse<EducationDto> response = new ApiResponse<>(
                true,
                "Education created successfully",
                createEducation
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EducationDto>>> getMyEducation() {
        List<EducationDto> education = educationService.getMyEducation();

        ApiResponse<List<EducationDto>> response = new ApiResponse<>(
                true,
                "Education fetched successfully",
                education
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EducationDto>> getEducationById(
            @PathVariable Long id
    ){
        EducationDto education = educationService.getEducationById(id);
        ApiResponse<EducationDto> response = new ApiResponse<>(
                true,
                "Education fetched successfully",
                education
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EducationDto>> updateEducation(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEducation request
    ) {
        EducationDto updatedEducation = educationService.updateEducation(id, request);

        ApiResponse<EducationDto> response = new ApiResponse<>(
                true,
                "Education updated successfully",
                updatedEducation
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEducation(
            @PathVariable Long id
    ) {
        educationService.deleteEducation(id);

        ApiResponse<Void> response = new ApiResponse<>(
                true,
                "Education deleted successfully",
                null
        );

        return ResponseEntity.ok(response);
    }
}
