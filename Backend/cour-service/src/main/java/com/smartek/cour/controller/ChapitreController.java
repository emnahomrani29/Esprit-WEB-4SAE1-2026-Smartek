package com.smartek.cour.controller;

import com.smartek.cour.dto.ChapitreRequest;
import com.smartek.cour.dto.ChapitreResponse;
import com.smartek.cour.service.ChapitreService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cours/{courId}/chapitres")
public class ChapitreController {

    private final ChapitreService chapitreService;

    public ChapitreController(ChapitreService chapitreService) {
        this.chapitreService = chapitreService;
    }

    @PostMapping
    public ResponseEntity<ChapitreResponse> create(@PathVariable Long courId,
                                                    @Valid @RequestBody ChapitreRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(chapitreService.create(courId, request));
    }

    @GetMapping
    public ResponseEntity<List<ChapitreResponse>> getByCour(@PathVariable Long courId) {
        return ResponseEntity.ok(chapitreService.getByCour(courId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChapitreResponse> update(@PathVariable Long courId,
                                                    @PathVariable Long id,
                                                    @Valid @RequestBody ChapitreRequest request) {
        return ResponseEntity.ok(chapitreService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long courId, @PathVariable Long id) {
        chapitreService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
