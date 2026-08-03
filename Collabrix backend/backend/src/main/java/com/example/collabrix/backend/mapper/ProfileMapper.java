package com.example.collabrix.backend.mapper;

import com.example.collabrix.backend.Dto.profile.profileDto;
import com.example.collabrix.backend.Dto.profile.updateprofilereq;
import com.example.collabrix.backend.Entity.UserEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Component
public class ProfileMapper {

    public static profileDto toDto(UserEntity user){
        return profileDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .headline(user.getHeadline())
                .bio(user.getBio())
                .location(user.getLocation())
                .website(user.getWebsite())
                .github(user.getGithub())
                .linkedin(user.getLinkedin())
                .profileImage(resolveMediaUrl(user.getProfileImage()))
                .coverImage(resolveMediaUrl(user.getCoverImage()))
                .build();
    }

    private static String resolveMediaUrl(String path) {
        if (path == null || path.isBlank()) {
            return path;
        }
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }
        if (path.startsWith("/uploads/")) {
            String mediaPath = path.replaceFirst("^/uploads/", "/api/media/");
            return ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path(mediaPath)
                    .toUriString();
        }
        if (path.startsWith("uploads/")) {
            String mediaPath = path.replaceFirst("^uploads/", "/api/media/");
            return ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path(mediaPath)
                    .toUriString();
        }
        return path;
    }

    public void updateEntityFromDto(
            updateprofilereq dto,
            UserEntity user
    ){
        user.setFullName(dto.getFullName());
        user.setHeadline(dto.getHeadline());
        user.setBio(dto.getBio());
        user.setLocation(dto.getLocation());
        user.setWebsite(dto.getWebsite());
        user.setGithub(dto.getGithub());
        user.setLinkedin(dto.getLinkedin());
    }
}
