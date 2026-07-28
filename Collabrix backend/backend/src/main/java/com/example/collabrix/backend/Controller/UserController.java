package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.UserSuggestionDto;
import com.example.collabrix.backend.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("suggestion")
    public List<UserSuggestionDto> getPeopleYouMayKnow(
            Authentication authentication
    ) {
        return userService.getPeopleYouMayKnow(authentication.getName());
    }
}
