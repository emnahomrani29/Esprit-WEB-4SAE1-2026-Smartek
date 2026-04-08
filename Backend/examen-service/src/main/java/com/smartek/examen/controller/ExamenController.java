package com.smartek.examen.controller;

import com.smartek.examen.dto.*;
import com.smartek.examen.service.ExamenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/examens")
@RequiredArgsConstructor
public class ExamenController {

    private final ExamenService examenService;

    // ── CRUD (Trainer) ─────────────────────────────────────
    @PostMapping
    public ResponseEntity<ExamenDTO> create(@Valid @RequestBody ExamenRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(examenService.create(req));
    }

    @GetMapping
    public ResponseEntity<List<ExamenDTO>> getAll() {
        return ResponseEntity.ok(examenService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamenDTO> getById(@PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean showCorrect) {
        return ResponseEntity.ok(examenService.getById(id, showCorrect));
    }

    // Récupérer l'examen d'un cours (pour le learner — sans les bonnes réponses)
    @GetMapping("/cours/{courId}")
    public ResponseEntity<ExamenDTO> getByCourId(@PathVariable Long courId,
            @RequestParam(defaultValue = "false") boolean showCorrect) {
        return ResponseEntity.ok(examenService.getByCourId(courId, showCorrect));
    }

    @GetMapping("/formation/{formationId}")
    public ResponseEntity<List<ExamenDTO>> getByFormationId(@PathVariable Long formationId) {
        return ResponseEntity.ok(examenService.getByFormationId(formationId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        examenService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ── Passer l'examen (Learner) ──────────────────────────
    @PostMapping("/{examenId}/passer")
    public ResponseEntity<TentativeDTO> passer(@PathVariable Long examenId,
                                                @RequestBody TentativeRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(examenService.passer(examenId, req));
    }

    // ── Résultats ──────────────────────────────────────────
    @GetMapping("/tentatives/apprenant/{apprenantId}")
    public ResponseEntity<List<TentativeDTO>> getTentativesByApprenant(@PathVariable String apprenantId) {
        return ResponseEntity.ok(examenService.getTentativesByApprenant(apprenantId));
    }

    @GetMapping("/{examenId}/tentatives")
    public ResponseEntity<List<TentativeDTO>> getTentativesByExamen(@PathVariable Long examenId) {
        return ResponseEntity.ok(examenService.getTentativesByExamen(examenId));
    }
}
