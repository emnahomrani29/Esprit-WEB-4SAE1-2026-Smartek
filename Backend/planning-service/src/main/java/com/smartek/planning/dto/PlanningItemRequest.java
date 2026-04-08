package com.smartek.planning.dto;

import com.smartek.planning.entity.TypeItem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PlanningItemRequest {
    @NotBlank
    private String titre;
    private String description;
    @NotNull
    private TypeItem type;
    private Long refId;
    private String lieu;
    private String responsable;
    @NotNull
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
}
