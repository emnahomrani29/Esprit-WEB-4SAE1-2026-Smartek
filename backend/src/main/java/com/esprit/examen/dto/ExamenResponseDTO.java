package com.esprit.examen.dto;

import com.esprit.examen.entities.StatutExamen;
import com.esprit.examen.entities.TypeExamen;
import lombok.*;

import java.time.LocalDateTime;

/**
 * DTO utilisé pour renvoyer les données des examens à travers l'API.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamenResponseDTO {
    private Long id;
    private String titre;
    private String matiere;
    private LocalDateTime dateExamen;
    private Integer duree;
    private String salle;
    private Double coefficient;
    private TypeExamen typeExamen;
    private StatutExamen statut;
}
