package com.example.collabrix.backend.Dto.profile;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class profileDto {
    private Long id;

    private String username;

    private String fullName;

    private String email;

    private String headline;

    private String bio;

    private String location;

    private String website;

    private String github;

    private String linkedin;

    private String profileImage;

    private String coverImage;
}
