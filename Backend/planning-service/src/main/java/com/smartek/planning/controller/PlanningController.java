package com.smartek.planning.controller;

import com.smartek.planning.dto.PlanningItemDTO;
import com.smartek.planning.dto.PlanningItemRequest;
import com.smartek.planning.entity.TypeItem;
import com.smartek.planning.service.PlanningService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/planning")
@RequiredArgsConstructor
public class PlanningController {

    private final PlanningService planningService;

    @PostMapping
    public ResponseEntity<PlanningItemDTO> create(@Valid @RequestBody PlanningItemRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(planningService.create(req));
    }

    @GetMapping
    public ResponseEntity<List<PlanningItemDTO>> getAll() {
        return ResponseEntity.ok(planningService.getAll());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<PlanningItemDTO>> getUpcoming() {
        return ResponseEntity.ok(planningService.getUpcoming());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<PlanningItemDTO>> getByType(@PathVariable TypeItem type) {
        return ResponseEntity.ok(planningService.getByType(type));
    }

    @GetMapping("/periode")
    public ResponseEntity<List<PlanningItemDTO>> getByPeriode(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        return ResponseEntity.ok(planningService.getByPeriode(from, to));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanningItemDTO> update(@PathVariable Long id,
                                                   @Valid @RequestBody PlanningItemRequest req) {
        return ResponseEntity.ok(planningService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        planningService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
