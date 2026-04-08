package com.smartek.cour.dto;

import jakarta.validation.constraints.NotBlank;

public class ChapitreRequest {

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    private String description;
    private Integer ordre;

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getOrdre() { return ordre; }
    public void setOrdre(Integer ordre) { this.ordre = ordre; }
}
