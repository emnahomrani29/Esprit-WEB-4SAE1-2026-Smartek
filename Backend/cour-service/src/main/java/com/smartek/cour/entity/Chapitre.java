package com.smartek.cour.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "chapitres")
public class Chapitre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer ordre = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cour_id", nullable = false)
    private Cour cour;

    public Chapitre() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getOrdre() { return ordre; }
    public void setOrdre(Integer ordre) { this.ordre = ordre; }

    public Cour getCour() { return cour; }
    public void setCour(Cour cour) { this.cour = cour; }
}
