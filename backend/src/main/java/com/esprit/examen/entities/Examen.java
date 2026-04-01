package com.esprit.examen.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entité représentant un Examen.
 */
@Entity
@Table(name = "examens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Examen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(nullable = false)
    private String matiere;

    @Column(name = "date_examen", nullable = false)
    private LocalDateTime dateExamen;

    @Column(nullable = false)
    private Integer duree; // Durée en minutes

    @Column(nullable = false)
    private String salle;

    private Double coefficient;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_examen", nullable = false)
    private TypeExamen typeExamen;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutExamen statut;
}
