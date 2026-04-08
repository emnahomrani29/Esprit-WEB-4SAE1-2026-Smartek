package com.smartek.examen.dto;

import lombok.Data;

@Data
public class ReponseDTO {
    private Long id;
    private String texte;
    private Boolean correcte; // null pour les learners, visible pour les trainers
}
