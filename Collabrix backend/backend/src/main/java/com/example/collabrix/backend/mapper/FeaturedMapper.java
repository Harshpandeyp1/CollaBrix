package com.example.collabrix.backend.mapper;

import com.example.collabrix.backend.Dto.Featured.CreateFeatured;
import com.example.collabrix.backend.Dto.Featured.FeaturedDto;
import com.example.collabrix.backend.Dto.Featured.UpdateFeatured;
import com.example.collabrix.backend.Entity.Featured;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FeaturedMapper {
    public static Featured toEntity(CreateFeatured request){
        Featured featured=new Featured();
        featured.setTitle(request.getTitle());
        featured.setDescription(request.getDescription());
        featured.setThumbnail(request.getThumbnail());
        featured.setUrl(request.getUrl());
        featured.setType(request.getType());

        return featured;
    }
    public FeaturedDto toDto(Featured featured) {

        FeaturedDto dto = new FeaturedDto();

        dto.setId(featured.getId());
        dto.setTitle(featured.getTitle());
        dto.setDescription(featured.getDescription());
        dto.setThumbnail(featured.getThumbnail());
        dto.setUrl(featured.getUrl());
        dto.setType(featured.getType());

        return dto;
    }
    public static void updateEntityFromDto(UpdateFeatured request,
                                           Featured featured) {

        featured.setTitle(request.getTitle());
        featured.setDescription(request.getDescription());
        featured.setThumbnail(request.getThumbnail());
        featured.setUrl(request.getUrl());
        featured.setType(request.getType());
    }
    public List<FeaturedDto> toDtoList(List<Featured> featuredList) {

        return featuredList.stream()
                .map(this::toDto)
                .toList();
    }
}
