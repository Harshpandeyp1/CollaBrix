package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.profile.profileDto;
import com.example.collabrix.backend.Dto.profile.updateprofilereq;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Repository.UserRepo;
import com.example.collabrix.backend.exception.ResourceNotFoundException;
import com.example.collabrix.backend.mapper.ProfileMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class profileService {
    private final UserRepo userRepo;
    private final ProfileMapper profileMapper;
    private final fileStorageService fileStorageService;

    private UserEntity getCurrUser(){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        String email=authentication.getName();
        return userRepo.findByEmail(email)
                .orElseThrow(()->new ResourceNotFoundException("user not found"));
    }
    public profileDto getMyProfile(){
        UserEntity user=getCurrUser();
        return profileMapper.toDto(user);
    }

    public profileDto getProfileById(Long id){
        UserEntity user= userRepo.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("user not found"));

        return profileMapper.toDto(user);
    }

    public profileDto updateProfile(updateprofilereq request){
        UserEntity user=getCurrUser();

        profileMapper.updateEntityFromDto(request, user);

        UserEntity updatedUser = userRepo.save(user);

        return profileMapper.toDto(updatedUser);
    }
    public profileDto uploadProfileImage(MultipartFile file) {
        UserEntity user = getCurrUser();

        String imagePath = fileStorageService.saveProfileImage(file);

        user.setProfileImage(imagePath);

        userRepo.save(user);


        return profileMapper.toDto(user);
    }
    public profileDto uploadCoverImage(MultipartFile file){
        UserEntity user=getCurrUser();
        String imagePath=fileStorageService.saveCoverImage(file);
        user.setCoverImage(imagePath);
        UserEntity updatedUser = userRepo.save(user);
        return profileMapper.toDto(updatedUser);
    }
}
