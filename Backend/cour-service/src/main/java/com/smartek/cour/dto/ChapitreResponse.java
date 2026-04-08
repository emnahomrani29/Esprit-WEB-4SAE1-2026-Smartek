package com.smartek.cour.dto;

public class ChapitreResponse {
    private Long id;
    private String titre;
    private String description;
    private Integer ordre;
    private Long courId;

    public ChapitreResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getOrdre() { return ordre; }
    public void setOrdre(Integer ordre) { this.ordre = ordre; }

    public Long getCourId() { return courId; }
    public void setCourId(Long courId) { this.courId = courId; }
}
