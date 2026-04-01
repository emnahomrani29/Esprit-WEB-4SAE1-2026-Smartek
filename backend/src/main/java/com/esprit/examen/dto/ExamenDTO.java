package com.esprit.examen.dto;

import com.esprit.examen.entities.StatutExamen;
import com.esprit.examen.entities.TypeExamen;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * DTO utilisé pour la création et la mise à jour des examens.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamenDTO {

    @NotBlank(message = "Le titre est obligatoire")
    @Size(min = 3, max = 100, message = "Le titre doit contenir entre 3 et 100 caractères")
    private String titre;

    @NotBlank(message = "La matière est obligatoire")
    private String matiere;

    @NotNull(message = "La date d'examen est obligatoire")
    @FutureOrPresent(message = "La date d'examen doit être dans le futur ou le présent")
    private LocalDateTime dateExamen;

    @NotNull(message = "La durée est obligatoire")
    @Min(value = 15, message = "La durée minimale est de 15 minutes")
    private Integer duree;

    @NotBlank(message = "La salle est obligatoire")
    private String salle;

    @NotNull(message = "Le coefficient est obligatoire")
    @Positive(message = "Le coefficient doit être un nombre positif")
    private Double coefficient;

    @NotNull(message = "Le type d'examen est obligatoire")
    private TypeExamen typeExamen;

    @NotNull(message = "Le statut est obligatoire")
    private StatutExamen statut;
}
