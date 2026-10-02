package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.profile.profileDto;
import com.example.collabrix.backend.Dto.profile.updateprofilereq;
import com.example.collabrix.backend.Entity.ConnectionEntity;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Enum.ConnectionStatus;
import com.example.collabrix.backend.Enum.ProfileRelationshipStatus;
import com.example.collabrix.backend.Repository.ConnectionRepo;
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
    private final ConnectionRepo connectionRepo;

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

    public profileDto getProfileById(Long id) {

        UserEntity profileUser = userRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("user not found")
                );

        UserEntity currentUser = getCurrUser();

        profileDto profile = profileMapper.toDto(profileUser);

        // Viewing your own profile
        if (currentUser.getId() == profileUser.getId()) {

            profile.setRelationshipStatus(
                    ProfileRelationshipStatus.SELF
            );

            return profile;
        }

        // Check whether a connection/request exists
        ConnectionEntity connection =
                connectionRepo
                        .findConnectionBetweenUsers(
                                currentUser,
                                profileUser
                        )
                        .orElse(null);

        // No connection/request
        if (connection == null) {

            profile.setRelationshipStatus(
                    ProfileRelationshipStatus.NONE
            );

            return profile;
        }

        // Already connected
        if (connection.getStatus() == ConnectionStatus.ACCEPTED) {

            profile.setRelationshipStatus(
                    ProfileRelationshipStatus.CONNECTED
            );

            return profile;
        }

        // Pending request
        if (connection.getStatus() == ConnectionStatus.PENDING) {

            if (connection.getSender()
                    .getId()
                    ==(currentUser.getId())) {

                profile.setRelationshipStatus(
                        ProfileRelationshipStatus.PENDING_SENT
                );

            } else {

                profile.setRelationshipStatus(
                        ProfileRelationshipStatus.PENDING_RECEIVED
                );
            }

            return profile;
        }

        // Fallback
        profile.setRelationshipStatus(
                ProfileRelationshipStatus.NONE
        );

        return profile;
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
