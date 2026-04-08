package com.smartek.cour.dto;

import com.smartek.cour.entity.Niveau;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CourRequest {

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    private String description;

    @NotBlank(message = "La catégorie est obligatoire")
    private String categorie;

    @NotNull(message = "Le niveau est obligatoire")
    private Niveau niveau;

    @Positive(message = "La durée doit être positive")
    private Integer dureeHeures;

    private String instructeur;

    private Double prix;

    private Boolean actif;

    private Long formationId;
    private Integer ordre;

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategorie() { return categorie; }
    public void setCategorie(String categorie) { this.categorie = categorie; }

    public Niveau getNiveau() { return niveau; }
    public void setNiveau(Niveau niveau) { this.niveau = niveau; }

    public Integer getDureeHeures() { return dureeHeures; }
    public void setDureeHeures(Integer dureeHeures) { this.dureeHeures = dureeHeures; }

    public String getInstructeur() { return instructeur; }
    public void setInstructeur(String instructeur) { this.instructeur = instructeur; }

    public Double getPrix() { return prix; }
    public void setPrix(Double prix) { this.prix = prix; }

    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }
}
