package com.smartek.formation.service;

import com.smartek.formation.dto.FormationRequest;
import com.smartek.formation.dto.FormationResponse;
import com.smartek.formation.entity.Formation;
import com.smartek.formation.repository.FormationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FormationService {

    private final FormationRepository formationRepository;

    public FormationResponse create(FormationRequest req) {
        Formation f = new Formation();
        f.setTitre(req.getTitre());
        f.setDescription(req.getDescription());
        f.setCategorie(req.getCategorie());
        f.setNiveau(req.getNiveau());
        f.setDuree(req.getDuree());
        f.setActif(req.getActif() != null ? req.getActif() : true);
        return toResponse(formationRepository.save(f));
    }

    public List<FormationResponse> getAll() {
        return formationRepository.findAll().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public FormationResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public FormationResponse update(Long id, FormationRequest req) {
        Formation f = findOrThrow(id);
        f.setTitre(req.getTitre());
        f.setDescription(req.getDescription());
        f.setCategorie(req.getCategorie());
        f.setNiveau(req.getNiveau());
        f.setDuree(req.getDuree());
        if (req.getActif() != null) f.setActif(req.getActif());
        return toResponse(formationRepository.save(f));
    }

    public void delete(Long id) {
        formationRepository.deleteById(id);
    }

    public FormationResponse addCour(Long formationId, Long courId) {
        Formation f = findOrThrow(formationId);
        if (!f.getCourIds().contains(courId)) {
            f.getCourIds().add(courId);
            formationRepository.save(f);
        }
        return toResponse(f);
    }

    public FormationResponse removeCour(Long formationId, Long courId) {
        Formation f = findOrThrow(formationId);
        f.getCourIds().remove(courId);
        formationRepository.save(f);
        return toResponse(f);
    }

    private Formation findOrThrow(Long id) {
        return formationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Formation introuvable: " + id));
    }

    private FormationResponse toResponse(Formation f) {
        FormationResponse r = new FormationResponse();
        r.setId(f.getId());
        r.setTitre(f.getTitre());
        r.setDescription(f.getDescription());
        r.setCategorie(f.getCategorie());
        r.setNiveau(f.getNiveau());
        r.setDuree(f.getDuree());
        r.setActif(f.getActif());
        r.setCourIds(f.getCourIds());
        r.setCreatedAt(f.getCreatedAt());
        r.setUpdatedAt(f.getUpdatedAt());
        return r;
    }
}
