package com.smartek.examen.dto;

import lombok.Data;
import java.util.List;

@Data
public class TentativeRequest {
    private String apprenantId;
    private List<Long> reponsesChoisies; // IDs des réponses sélectionnées
}
