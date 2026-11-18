package com.example.collabrix.backend.Dto.Search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class SearchUserDto {

    private Long id;
    private String username;
    private String fullName;
    private String headline;
    private String profileImage;
}