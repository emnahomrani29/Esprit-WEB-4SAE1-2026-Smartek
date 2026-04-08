package com.smartek.cour.controller;

import com.smartek.cour.dto.CourRequest;
import com.smartek.cour.dto.CourResponse;
import com.smartek.cour.entity.Niveau;
import com.smartek.cour.service.CourService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cours")
public class CourController {

    private final CourService courService;

    public CourController(CourService courService) {
        this.courService = courService;
    }

    @PostMapping
    public ResponseEntity<CourResponse> create(@Valid @RequestBody CourRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(courService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<CourResponse>> getAll() {
        return ResponseEntity.ok(courService.getAll());
    }

    @GetMapping("/actifs")
    public ResponseEntity<List<CourResponse>> getActifs() {
        return ResponseEntity.ok(courService.getActifs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(courService.getById(id));
    }

    @GetMapping("/categorie/{categorie}")
    public ResponseEntity<List<CourResponse>> getByCategorie(@PathVariable String categorie) {
        return ResponseEntity.ok(courService.getByCategorie(categorie));
    }

    @GetMapping("/niveau/{niveau}")
    public ResponseEntity<List<CourResponse>> getByNiveau(@PathVariable Niveau niveau) {
        return ResponseEntity.ok(courService.getByNiveau(niveau));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourResponse> update(@PathVariable Long id,
                                               @Valid @RequestBody CourRequest request) {
        return ResponseEntity.ok(courService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        courService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
