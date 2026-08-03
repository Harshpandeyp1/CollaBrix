package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.common.ApiResponse;
import com.example.collabrix.backend.Dto.profile.profileDto;
import com.example.collabrix.backend.Dto.profile.updateprofilereq;
import com.example.collabrix.backend.Service.profileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class profileController {
    private final profileService profileService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<profileDto>> getMyProfile() {

        profileDto profile = profileService.getMyProfile();

        return ResponseEntity.ok(
                ApiResponse.<profileDto>builder()
                        .success(true)
                        .message("Profile fetched successfully")
                        .data(profile)
                        .build()
        );
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<profileDto>> getProfileById(
            @PathVariable Long id) {

        profileDto profile = profileService.getProfileById(id);

        return ResponseEntity.ok(
                ApiResponse.<profileDto>builder()
                        .success(true)
                        .message("Profile fetched successfully")
                        .data(profile)
                        .build()
        );
    }
    @PutMapping
    public ResponseEntity<ApiResponse<profileDto>> updateProfile(
            @Valid @RequestBody updateprofilereq request) {

        profileDto profile = profileService.updateProfile(request);

        return ResponseEntity.ok(
                ApiResponse.<profileDto>builder()
                        .success(true)
                        .message("Profile updated successfully")
                        .data(profile)
                        .build()
        );
    }
    @PostMapping("/profile-image")
    public ResponseEntity<profileDto> uploadProfileImage(
            @RequestParam("file") MultipartFile file) {

        profileDto updatedProfile = profileService.uploadProfileImage(file);

        return ResponseEntity.ok(updatedProfile);
    }
    @PostMapping("/cover-image")
    public ResponseEntity<profileDto> uploadCoverImage(
            @RequestParam("file") MultipartFile file) {

        profileDto updatedProfile = profileService.uploadCoverImage(file);

        return ResponseEntity.ok(updatedProfile);
    }
}
