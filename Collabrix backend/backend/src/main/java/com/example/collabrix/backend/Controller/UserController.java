package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.auth.UserSuggestionDto;
import com.example.collabrix.backend.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("suggestion")
    public List<UserSuggestionDto> getPeopleYouMayKnow(
            Authentication authentication
    ) {
        System.out.println("Controller Hit");
        return userService.getPeopleYouMayKnow(authentication.getName());
    }
}
