package com.smartek.examen.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuestionDTO {
    private Long id;
    private String enonce;
    private Integer points;
    private List<ReponseDTO> reponses;
}
