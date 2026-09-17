package com.example.collabrix.backend.Controller;

import com.example.collabrix.backend.Dto.ProjectMember.ProjectMemberDto;
import com.example.collabrix.backend.Service.ProjectMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playground")
@RequiredArgsConstructor
public class ProjectMemberController {

    private final ProjectMemberService projectMemberService;

    @GetMapping("/{projectId}/members")
    public ResponseEntity<List<ProjectMemberDto>> getProjectMembers(
            @PathVariable Long projectId) {

        List<ProjectMemberDto> members =
                projectMemberService.getProjectMembers(projectId);

        return ResponseEntity.ok(members);
    }
}