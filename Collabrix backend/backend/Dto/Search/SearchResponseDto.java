package com.example.collabrix.backend.Dto.Search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class SearchResponseDto {

    private List<SearchUserDto> users;
    private List<SearchProjectDto> projects;
}