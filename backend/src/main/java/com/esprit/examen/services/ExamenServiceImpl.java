package com.esprit.examen.services;

import com.esprit.examen.dto.ExamenDTO;
import com.esprit.examen.dto.ExamenResponseDTO;
import com.esprit.examen.entities.Examen;
import com.esprit.examen.entities.StatutExamen;
import com.esprit.examen.exceptions.EntityNotFoundException;
import com.esprit.examen.mapper.ExamenMapper;
import com.esprit.examen.repositories.ExamenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implémentation du service de gestion des examens.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ExamenServiceImpl implements ExamenService {

    private final ExamenRepository examenRepository;
    private final ExamenMapper examenMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ExamenResponseDTO> getAllExamens() {
        log.info("Récupération de tous les examens");
        return examenRepository.findAll().stream()
                .map(examenMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ExamenResponseDTO getExamenById(Long id) {
        log.info("Récupération de l'examen avec l'ID {}", id);
        Examen examen = examenRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Examen non trouvé avec l'id : " + id));
        return examenMapper.toResponseDto(examen);
    }

    @Override
    public ExamenResponseDTO createExamen(ExamenDTO dto) {
        log.info("Création d'un nouvel examen : {}", dto.getTitre());
        Examen examen = examenMapper.toEntity(dto);
        Examen savedExamen = examenRepository.save(examen);
        return examenMapper.toResponseDto(savedExamen);
    }

    @Override
    public ExamenResponseDTO updateExamen(Long id, ExamenDTO dto) {
        log.info("Mise à jour de l'examen avec l'ID {}", id);
        Examen examen = examenRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Examen non trouvé avec l'id : " + id));
        
        examenMapper.updateEntityFromDto(dto, examen);
        Examen updatedExamen = examenRepository.save(examen);
        return examenMapper.toResponseDto(updatedExamen);
    }

    @Override
    public void deleteExamen(Long id) {
        log.info("Suppression de l'examen avec l'ID {}", id);
        if (!examenRepository.existsById(id)) {
            throw new EntityNotFoundException("Examen non trouvé avec l'id : " + id);
        }
        examenRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamenResponseDTO> getExamensByMatiere(String matiere) {
        log.info("Récupération des examens pour la matière : {}", matiere);
        return examenRepository.findByMatiere(matiere).stream()
                .map(examenMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamenResponseDTO> getExamensAujourdhui() {
        log.info("Récupération des examens d'aujourd'hui");
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.MAX);
        
        return examenRepository.findByDateExamenBetween(startOfDay, endOfDay).stream()
                .map(examenMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public ExamenResponseDTO changeStatut(Long id, StatutExamen newStatut) {
        log.info("Modification du statut de l'examen {} vers {}", id, newStatut);
        Examen examen = examenRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Examen non trouvé avec l'id : " + id));
        
        examen.setStatut(newStatut);
        Examen updatedExamen = examenRepository.save(examen);
        return examenMapper.toResponseDto(updatedExamen);
    }
}
