package com.smartek.cour.service;

import com.smartek.cour.dto.ChapitreRequest;
import com.smartek.cour.dto.ChapitreResponse;
import com.smartek.cour.entity.Chapitre;
import com.smartek.cour.entity.Cour;
import com.smartek.cour.repository.ChapitreRepository;
import com.smartek.cour.repository.CourRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChapitreService {

    private final ChapitreRepository chapitreRepository;
    private final CourRepository courRepository;

    public ChapitreService(ChapitreRepository chapitreRepository, CourRepository courRepository) {
        this.chapitreRepository = chapitreRepository;
        this.courRepository = courRepository;
    }

    public ChapitreResponse create(Long courId, ChapitreRequest request) {
        Cour cour = courRepository.findById(courId)
                .orElseThrow(() -> new EntityNotFoundException("Cours introuvable: " + courId));
        Chapitre ch = new Chapitre();
        ch.setTitre(request.getTitre());
        ch.setDescription(request.getDescription());
        ch.setOrdre(request.getOrdre() != null ? request.getOrdre() : 1);
        ch.setCour(cour);
        return toResponse(chapitreRepository.save(ch));
    }

    public List<ChapitreResponse> getByCour(Long courId) {
        return chapitreRepository.findByCourIdOrderByOrdreAsc(courId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ChapitreResponse update(Long id, ChapitreRequest request) {
        Chapitre ch = chapitreRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Chapitre introuvable: " + id));
        ch.setTitre(request.getTitre());
        ch.setDescription(request.getDescription());
        if (request.getOrdre() != null) ch.setOrdre(request.getOrdre());
        return toResponse(chapitreRepository.save(ch));
    }

    public void delete(Long id) {
        chapitreRepository.deleteById(id);
    }

    private ChapitreResponse toResponse(Chapitre ch) {
        ChapitreResponse r = new ChapitreResponse();
        r.setId(ch.getId());
        r.setTitre(ch.getTitre());
        r.setDescription(ch.getDescription());
        r.setOrdre(ch.getOrdre());
        r.setCourId(ch.getCour().getId());
        return r;
    }
}
