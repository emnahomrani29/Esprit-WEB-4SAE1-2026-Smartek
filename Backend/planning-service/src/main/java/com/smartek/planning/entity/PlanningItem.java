package com.smartek.planning.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "planning_items")
@Data
@NoArgsConstructor
public class PlanningItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeItem type; // EVENT, COURS, EXAMEN

    private Long refId;        // ID dans le microservice source
    private String lieu;
    private String responsable;

    @Column(nullable = false)
    private LocalDateTime dateDebut;

    private LocalDateTime dateFin;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
