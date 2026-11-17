package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.Search.SearchResponseDto;
import com.example.collabrix.backend.Service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<SearchResponseDto> search(
            @RequestParam String q
    ) {

        SearchResponseDto result =
                searchService.search(q);

        return ResponseEntity.ok(result);
    }
}