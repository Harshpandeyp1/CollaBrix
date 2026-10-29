package com.example.collabrix.backend.Dto.Featured;

import com.example.collabrix.backend.Enum.FeaturedType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeaturedDto {

    private Long id;

    private String title;

    private String description;

    private String thumbnail;

    private String url;

    private FeaturedType type;
}
