package com.example.collabrix.backend.Dto.Featured;

import com.example.collabrix.backend.Enum.FeaturedType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateFeatured {

    @NotBlank
    private String title;

    private String description;

    private String thumbnail;

    @NotBlank
    private String url;

    @NotNull
    private FeaturedType type;
}
