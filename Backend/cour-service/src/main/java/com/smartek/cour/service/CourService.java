package com.smartek.cour.service;

import com.smartek.cour.dto.CourRequest;
import com.smartek.cour.dto.CourResponse;
import com.smartek.cour.entity.Cour;
import com.smartek.cour.entity.Niveau;
import com.smartek.cour.repository.CourRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourService {

    private final CourRepository courRepository;

    public CourService(CourRepository courRepository) {
        this.courRepository = courRepository;
    }

    public CourResponse create(CourRequest request) {
        Cour cour = new Cour();
        cour.setTitre(request.getTitre());
        cour.setDescription(request.getDescription());
        cour.setCategorie(request.getCategorie());
        cour.setNiveau(request.getNiveau());
        cour.setDureeHeures(request.getDureeHeures());
        cour.setInstructeur(request.getInstructeur());
        cour.setPrix(request.getPrix());
        cour.setActif(request.getActif() != null ? request.getActif() : true);
        return toResponse(courRepository.save(cour));
    }

    public List<CourResponse> getAll() {
        return courRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<CourResponse> getActifs() {
        return courRepository.findByActifTrue().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CourResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public List<CourResponse> getByCategorie(String categorie) {
        return courRepository.findByCategorie(categorie).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<CourResponse> getByNiveau(Niveau niveau) {
        return courRepository.findByNiveau(niveau).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CourResponse update(Long id, CourRequest request) {
        Cour cour = findOrThrow(id);
        cour.setTitre(request.getTitre());
        cour.setDescription(request.getDescription());
        cour.setCategorie(request.getCategorie());
        cour.setNiveau(request.getNiveau());
        cour.setDureeHeures(request.getDureeHeures());
        cour.setInstructeur(request.getInstructeur());
        cour.setPrix(request.getPrix());
        if (request.getActif() != null) cour.setActif(request.getActif());
        return toResponse(courRepository.save(cour));
    }

    public void delete(Long id) {
        findOrThrow(id);
        courRepository.deleteById(id);
    }

    private Cour findOrThrow(Long id) {
        return courRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cours introuvable avec l'id: " + id));
    }

    private CourResponse toResponse(Cour cour) {
        return CourResponse.builder()
                .id(cour.getId())
                .titre(cour.getTitre())
                .description(cour.getDescription())
                .categorie(cour.getCategorie())
                .niveau(cour.getNiveau())
                .dureeHeures(cour.getDureeHeures())
                .instructeur(cour.getInstructeur())
                .prix(cour.getPrix())
                .actif(cour.getActif())
                .createdAt(cour.getCreatedAt())
                .updatedAt(cour.getUpdatedAt())
                .build();
    }
}
