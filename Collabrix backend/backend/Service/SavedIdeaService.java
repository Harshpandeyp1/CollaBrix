package com.example.collabrix.backend.Service;

import com.example.collabrix.backend.Dto.Idea.IdeaDto;
import com.example.collabrix.backend.Entity.IdeaEntity;
import com.example.collabrix.backend.Entity.SavedIdea;
import com.example.collabrix.backend.Repository.IdeaRepository;
import com.example.collabrix.backend.Repository.SavedIdeaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class SavedIdeaService {

    private final SavedIdeaRepository savedIdeaRepository;
    private final IdeaRepository ideaRepository;
    private final IdeaService ideaService;

    @Transactional
    public void save(Long userId, Long ideaId) {

        // already saved -> nothing to do (keeps the call idempotent)
        if (savedIdeaRepository.existsByUserIdAndIdeaId(userId, ideaId)) {
            return;
        }

        IdeaEntity idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Idea not found"));

        if (Objects.equals(idea.getCreatedBy().getId(), userId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "You cannot save your own idea");
        }

        SavedIdea saved = new SavedIdea();
        saved.setUserId(userId);
        saved.setIdea(idea);

        savedIdeaRepository.save(saved);
    }

    @Transactional
    public void unsave(Long userId, Long ideaId) {
        savedIdeaRepository.deleteByUserIdAndIdeaId(userId, ideaId);
    }

    /**
     * Returns the user's saved ideas as normal IdeaDtos,
     * so the frontend can render them with the same card as the feed.
     */
    @Transactional(readOnly = true)
    public List<IdeaDto> getSavedIdeas(Long userId) {
        return savedIdeaRepository.findByUserIdOrderBySavedAtDesc(userId)
                .stream()
                .map(s -> ideaService.toDto(s.getIdea()))
                .toList();
    }
}
