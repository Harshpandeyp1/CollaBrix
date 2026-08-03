package com.example.collabrix.backend.Dto.profile;

import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class updateProfileDto {

    @Size(max = 100)
    private String fullName;

    @Size(max = 150)
    private String headline;

    @Size(max = 500)
    private String bio;

    @Size(max = 100)
    private String location;

    @Size(max = 255)
    private String website;

    @Size(max = 255)
    private String github;

    @Size(max = 255)
    private String linkedin;
}