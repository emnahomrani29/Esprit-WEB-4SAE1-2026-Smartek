package com.smartek.examen.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TentativeDTO {
    private Long id;
    private Long examenId;
    private String examenTitre;
    private String apprenantId;
    private Integer score;
    private Boolean reussi;
    private List<Long> reponsesChoisies;
    private LocalDateTime passedAt;
}
