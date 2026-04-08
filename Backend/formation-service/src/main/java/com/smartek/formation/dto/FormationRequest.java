package com.smartek.formation.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FormationRequest {
    @NotBlank(message = "Le titre est obligatoire")
    private String titre;
    private String description;
    private String categorie;
    private String niveau;
    private String duree;
    private Boolean actif;
}
