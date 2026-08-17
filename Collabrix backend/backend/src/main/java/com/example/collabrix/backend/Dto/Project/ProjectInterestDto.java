package com.example.collabrix.backend.Dto.Project;

import com.example.collabrix.backend.Enum.InterestStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectInterestDto {

    private Long id;

    private Long projectId;

    private Long userId;

    private String username;

    private String fullName;

    private String profileImage;

    private InterestStatus status;

    private LocalDateTime createdAt;
}