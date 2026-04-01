package com.esprit.examen.controllers;

import com.esprit.examen.dto.ExamenDTO;
import com.esprit.examen.dto.ExamenResponseDTO;
import com.esprit.examen.entities.StatutExamen;
import com.esprit.examen.services.ExamenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des examens.
 */
@RestController
@RequestMapping("/api/examens")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200") // Angular Frontend Port
public class ExamenController {

    private final ExamenService examenService;

    @GetMapping
    public ResponseEntity<List<ExamenResponseDTO>> getAllExamens() {
        return ResponseEntity.ok(examenService.getAllExamens());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamenResponseDTO> getExamenById(@PathVariable Long id) {
        return ResponseEntity.ok(examenService.getExamenById(id));
    }

    @PostMapping
    public ResponseEntity<ExamenResponseDTO> createExamen(@Valid @RequestBody ExamenDTO dto) {
        ExamenResponseDTO response = examenService.createExamen(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExamenResponseDTO> updateExamen(
            @PathVariable Long id,
            @Valid @RequestBody ExamenDTO dto) {
        return ResponseEntity.ok(examenService.updateExamen(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExamen(@PathVariable Long id) {
        examenService.deleteExamen(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/matiere/{matiere}")
    public ResponseEntity<List<ExamenResponseDTO>> getExamensByMatiere(@PathVariable String matiere) {
        return ResponseEntity.ok(examenService.getExamensByMatiere(matiere));
    }

    @GetMapping("/today")
    public ResponseEntity<List<ExamenResponseDTO>> getExamensAujourdhui() {
        return ResponseEntity.ok(examenService.getExamensAujourdhui());
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<ExamenResponseDTO> changeStatut(
            @PathVariable Long id,
            @RequestParam StatutExamen statut) {
        return ResponseEntity.ok(examenService.changeStatut(id, statut));
    }
}
