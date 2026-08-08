package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.common.ApiResponse;
import com.example.collabrix.backend.Dto.Featured.CreateFeatured;
import com.example.collabrix.backend.Dto.Featured.UpdateFeatured;
import com.example.collabrix.backend.Dto.Featured.FeaturedDto;
import com.example.collabrix.backend.Service.FeaturedService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/featured")
@RequiredArgsConstructor
public class FeaturedController {
    private final FeaturedService featuredService;

    @PostMapping("")
    public ResponseEntity<ApiResponse<FeaturedDto>> createFeatured(
            @Valid @RequestBody CreateFeatured request
    ) {
        FeaturedDto createdFeatured = featuredService.createFeatured(request);

        ApiResponse<FeaturedDto> response = new ApiResponse<>(
                true,
                "Featured item created successfully",
                createdFeatured
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FeaturedDto>>> getMyFeatured() {
        List<FeaturedDto> featuredList = featuredService.getMyFeatured();

        ApiResponse<List<FeaturedDto>> response = new ApiResponse<>(
                true,
                "Featured items fetched successfully",
                featuredList
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FeaturedDto>> getFeaturedById(
            @PathVariable Long id
    ) {
        FeaturedDto featured = featuredService.getFeaturedById(id);

        ApiResponse<FeaturedDto> response = new ApiResponse<>(
                true,
                "Featured item fetched successfully",
                featured
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FeaturedDto>> updateFeatured(
            @PathVariable Long id,
            @Valid @RequestBody UpdateFeatured request
    ) {
        FeaturedDto updatedFeatured = featuredService.updateFeatured(id, request);

        ApiResponse<FeaturedDto> response = new ApiResponse<>(
                true,
                "Featured item updated successfully",
                updatedFeatured
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFeatured(
            @PathVariable Long id
    ) {
        featuredService.deleteFeatured(id);

        ApiResponse<Void> response = new ApiResponse<>(
                true,
                "Featured item deleted successfully",
                null
        );

        return ResponseEntity.ok(response);
    }
}
