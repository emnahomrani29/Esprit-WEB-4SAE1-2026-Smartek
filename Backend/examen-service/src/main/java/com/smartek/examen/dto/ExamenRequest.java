package com.smartek.examen.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class ExamenRequest {
    @NotBlank
    private String titre;
    private String description;
    private Long courId;
    private Long formationId;
    private Integer dureeMinutes = 60;
    private Integer scoreMinimal = 50;
    private List<QuestionRequest> questions;

    @Data
    public static class QuestionRequest {
        @NotBlank
        private String enonce;
        private Integer points = 1;
        private List<ReponseRequest> reponses;
    }

    @Data
    public static class ReponseRequest {
        @NotBlank
        private String texte;
        private Boolean correcte = false;
    }
}
