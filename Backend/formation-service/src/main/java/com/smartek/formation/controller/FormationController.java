package com.smartek.formation.controller;

import com.smartek.formation.dto.FormationRequest;
import com.smartek.formation.dto.FormationResponse;
import com.smartek.formation.service.FormationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formations")
@RequiredArgsConstructor
public class FormationController {

    private final FormationService formationService;

    @PostMapping
    public ResponseEntity<FormationResponse> create(@Valid @RequestBody FormationRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(formationService.create(req));
    }

    @GetMapping
    public ResponseEntity<List<FormationResponse>> getAll() {
        return ResponseEntity.ok(formationService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FormationResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(formationService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FormationResponse> update(@PathVariable Long id,
                                                     @Valid @RequestBody FormationRequest req) {
        return ResponseEntity.ok(formationService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        formationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{formationId}/cours/{courId}")
    public ResponseEntity<FormationResponse> addCour(@PathVariable Long formationId,
                                                      @PathVariable Long courId) {
        return ResponseEntity.ok(formationService.addCour(formationId, courId));
    }

    @DeleteMapping("/{formationId}/cours/{courId}")
    public ResponseEntity<FormationResponse> removeCour(@PathVariable Long formationId,
                                                         @PathVariable Long courId) {
        return ResponseEntity.ok(formationService.removeCour(formationId, courId));
    }
}
