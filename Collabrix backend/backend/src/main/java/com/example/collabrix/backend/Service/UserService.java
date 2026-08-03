package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.auth.UserSuggestionDto;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private  final UserRepo userRepo;

    public List<UserSuggestionDto> getPeopleYouMayKnow(String currentUserEmail){
        UserEntity currentUser = userRepo.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UserEntity> users = userRepo.findTop10ByIdNot(currentUser.getId());

        return users.stream()
                .map(user -> UserSuggestionDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .build()
                )
                .toList();
    }
}
