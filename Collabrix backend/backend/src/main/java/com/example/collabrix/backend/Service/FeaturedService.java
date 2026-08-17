package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.Featured.CreateFeatured;
import com.example.collabrix.backend.Dto.Featured.FeaturedDto;
import com.example.collabrix.backend.Dto.Featured.UpdateFeatured;

import com.example.collabrix.backend.Dto.experience.experienceDto;
import com.example.collabrix.backend.Entity.Experience;
import com.example.collabrix.backend.Entity.Featured;
import com.example.collabrix.backend.Entity.UserEntity;
import com.example.collabrix.backend.Repository.FeaturedRepo;
import com.example.collabrix.backend.Repository.UserRepo;
import com.example.collabrix.backend.exception.ResourceNotFoundException;
import com.example.collabrix.backend.mapper.FeaturedMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class FeaturedService {
    private final UserRepo userRepo;
    private final FeaturedRepo featuredRepo;
    private final FeaturedMapper featuredMapper;

    private UserEntity getCurrentUser(){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        String email =authentication.getName();
        return userRepo.findByEmail(email)
                .orElseThrow(()->new ResourceNotFoundException("user not found"));
    }
    private Featured getFeaturedForCurrentUser(Long id){
        UserEntity entity=getCurrentUser();
        return featuredRepo.findById(id)
                .orElseThrow(()->
                        new RuntimeException("Featured not found"));
    }
    @Transactional
    public FeaturedDto createFeatured(CreateFeatured request) {
        UserEntity currentUser = getCurrentUser();

        Featured featured = FeaturedMapper.toEntity(request);
        featured.setUser(currentUser);

        Featured saved = featuredRepo.save(featured);
        return featuredMapper.toDto(saved);
    }
    public List<FeaturedDto> getMyFeatured() {
        UserEntity currentUser = getCurrentUser();
        List<Featured> featured = featuredRepo.findByUser(currentUser);
        return featuredMapper.toDtoList(featured);
    }

    public FeaturedDto getFeaturedById(Long id){
        Featured featured=getFeaturedForCurrentUser(id);
        return featuredMapper.toDto(featured);
   }
   @Transactional
   public FeaturedDto updateFeatured(Long id, UpdateFeatured request){
        Featured featured=getFeaturedForCurrentUser(id);
        FeaturedMapper.updateEntityFromDto(request,featured);
        Featured updated=featuredRepo.save(featured);
        return featuredMapper.toDto(updated);
   }
    @Transactional
    public void deleteFeatured(Long id) {
        Featured featured = getFeaturedForCurrentUser(id);
        featuredRepo.delete(featured);
    }
}
