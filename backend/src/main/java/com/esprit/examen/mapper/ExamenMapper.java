package com.esprit.examen.mapper;

import com.esprit.examen.dto.ExamenDTO;
import com.esprit.examen.dto.ExamenResponseDTO;
import com.esprit.examen.entities.Examen;
import org.springframework.stereotype.Component;

/**
 * Composant de mapping manuel pour convertir les entités et DTOs (pour éviter les dépendances MapStruct complexes).
 */
@Component
public class ExamenMapper {

    /**
     * Convertit un Examen (Entité) vers un ExamenResponseDTO.
     */
    public ExamenResponseDTO toResponseDto(Examen examen) {
        if (examen == null) return null;

        return ExamenResponseDTO.builder()
                .id(examen.getId())
                .titre(examen.getTitre())
                .matiere(examen.getMatiere())
                .dateExamen(examen.getDateExamen())
                .duree(examen.getDuree())
                .salle(examen.getSalle())
                .coefficient(examen.getCoefficient())
                .typeExamen(examen.getTypeExamen())
                .statut(examen.getStatut())
                .build();
    }

    /**
     * Convertit un ExamenDTO vers un Examen (Entité).
     */
    public Examen toEntity(ExamenDTO dto) {
        if (dto == null) return null;

        return Examen.builder()
                .titre(dto.getTitre())
                .matiere(dto.getMatiere())
                .dateExamen(dto.getDateExamen())
                .duree(dto.getDuree())
                .salle(dto.getSalle())
                .coefficient(dto.getCoefficient())
                .typeExamen(dto.getTypeExamen())
                .statut(dto.getStatut())
                .build();
    }

    /**
     * Met à jour une entité existante à partir d'un DTO.
     */
    public void updateEntityFromDto(ExamenDTO dto, Examen examen) {
        if (dto == null || examen == null) return;

        examen.setTitre(dto.getTitre());
        examen.setMatiere(dto.getMatiere());
        examen.setDateExamen(dto.getDateExamen());
        examen.setDuree(dto.getDuree());
        examen.setSalle(dto.getSalle());
        examen.setCoefficient(dto.getCoefficient());
        examen.setTypeExamen(dto.getTypeExamen());
        examen.setStatut(dto.getStatut());
    }
}
