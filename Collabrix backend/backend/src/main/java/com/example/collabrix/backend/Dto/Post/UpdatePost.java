package com.example.collabrix.backend.Dto.Post;

import com.example.collabrix.backend.Entity.Post;
import com.example.collabrix.backend.Enum.PostStatus;
import lombok.Data;

import java.util.List;

@Data
public class UpdatePost {

    private String title;

    private String description;

    private List<String> techStack;

    private List<String> rolesNeeded;

    private PostStatus status;

    private Integer teamSizeNeeded;

    private String duration;

    private String githubUrl;

    private String demoUrl;

    private String bannerImage;

    private List<String> tags;


    private Long projectId;
}

