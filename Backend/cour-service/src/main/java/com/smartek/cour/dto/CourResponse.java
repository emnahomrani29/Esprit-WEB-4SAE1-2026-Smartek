package com.smartek.cour.dto;

import com.smartek.cour.entity.Niveau;

import java.time.LocalDateTime;

public class CourResponse {
    private Long id;
    private String titre;
    private String description;
    private String categorie;
    private Niveau niveau;
    private Integer dureeHeures;
    private String instructeur;
    private Double prix;
    private Boolean actif;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CourResponse() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final CourResponse r = new CourResponse();
        public Builder id(Long v) { r.id = v; return this; }
        public Builder titre(String v) { r.titre = v; return this; }
        public Builder description(String v) { r.description = v; return this; }
        public Builder categorie(String v) { r.categorie = v; return this; }
        public Builder niveau(Niveau v) { r.niveau = v; return this; }
        public Builder dureeHeures(Integer v) { r.dureeHeures = v; return this; }
        public Builder instructeur(String v) { r.instructeur = v; return this; }
        public Builder prix(Double v) { r.prix = v; return this; }
        public Builder actif(Boolean v) { r.actif = v; return this; }
        public Builder createdAt(LocalDateTime v) { r.createdAt = v; return this; }
        public Builder updatedAt(LocalDateTime v) { r.updatedAt = v; return this; }
        public CourResponse build() { return r; }
    }

    public Long getId() { return id; }
    public String getTitre() { return titre; }
    public String getDescription() { return description; }
    public String getCategorie() { return categorie; }
    public Niveau getNiveau() { return niveau; }
    public Integer getDureeHeures() { return dureeHeures; }
    public String getInstructeur() { return instructeur; }
    public Double getPrix() { return prix; }
    public Boolean getActif() { return actif; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
