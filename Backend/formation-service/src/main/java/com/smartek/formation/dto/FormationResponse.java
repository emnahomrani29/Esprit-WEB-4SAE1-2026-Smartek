package com.smartek.formation.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class FormationResponse {
    private Long id;
    private String titre;
    private String description;
    private String categorie;
    private String niveau;
    private String duree;
    private Boolean actif;
    private List<Long> courIds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
