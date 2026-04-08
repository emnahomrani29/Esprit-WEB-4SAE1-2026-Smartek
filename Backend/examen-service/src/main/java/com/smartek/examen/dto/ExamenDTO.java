package com.smartek.examen.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ExamenDTO {
    private Long id;
    private String titre;
    private String description;
    private Long courId;
    private Long formationId;
    private Integer dureeMinutes;
    private Integer scoreMinimal;
    private List<QuestionDTO> questions;
    private LocalDateTime createdAt;
}
