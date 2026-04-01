package com.esprit.examen.services;

import com.esprit.examen.dto.ExamenDTO;
import com.esprit.examen.dto.ExamenResponseDTO;
import com.esprit.examen.entities.StatutExamen;

import java.util.List;

/**
 * Interface du service de gestion des examens.
 */
public interface ExamenService {
    List<ExamenResponseDTO> getAllExamens();
    ExamenResponseDTO getExamenById(Long id);
    ExamenResponseDTO createExamen(ExamenDTO dto);
    ExamenResponseDTO updateExamen(Long id, ExamenDTO dto);
    void deleteExamen(Long id);
    
    List<ExamenResponseDTO> getExamensByMatiere(String matiere);
    List<ExamenResponseDTO> getExamensAujourdhui();
    ExamenResponseDTO changeStatut(Long id, StatutExamen newStatut);
}
