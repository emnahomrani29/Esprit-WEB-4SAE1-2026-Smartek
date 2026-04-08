package com.smartek.planning.dto;

import com.smartek.planning.entity.TypeItem;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PlanningItemDTO {
    private Long id;
    private String titre;
    private String description;
    private TypeItem type;
    private Long refId;
    private String lieu;
    private String responsable;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private LocalDateTime createdAt;
}
