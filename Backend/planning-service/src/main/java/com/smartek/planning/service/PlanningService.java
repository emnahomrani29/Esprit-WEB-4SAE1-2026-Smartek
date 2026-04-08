package com.smartek.planning.service;

import com.smartek.planning.dto.PlanningItemDTO;
import com.smartek.planning.dto.PlanningItemRequest;
import com.smartek.planning.entity.PlanningItem;
import com.smartek.planning.entity.TypeItem;
import com.smartek.planning.repository.PlanningRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlanningService {

    private final PlanningRepository planningRepository;

    public PlanningItemDTO create(PlanningItemRequest req) {
        PlanningItem item = new PlanningItem();
        mapFromRequest(item, req);
        return toDTO(planningRepository.save(item));
    }

    public List<PlanningItemDTO> getAll() {
        return planningRepository.findAll().stream()
                .sorted((a, b) -> a.getDateDebut().compareTo(b.getDateDebut()))
                .map(this::toDTO).collect(Collectors.toList());
    }

    public List<PlanningItemDTO> getByType(TypeItem type) {
        return planningRepository.findByType(type).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    public List<PlanningItemDTO> getByPeriode(LocalDateTime from, LocalDateTime to) {
        return planningRepository.findByDateDebutBetweenOrderByDateDebutAsc(from, to).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    public List<PlanningItemDTO> getUpcoming() {
        return planningRepository.findUpcoming(LocalDateTime.now()).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    public PlanningItemDTO update(Long id, PlanningItemRequest req) {
        PlanningItem item = findOrThrow(id);
        mapFromRequest(item, req);
        return toDTO(planningRepository.save(item));
    }

    public void delete(Long id) {
        planningRepository.deleteById(id);
    }

    private void mapFromRequest(PlanningItem item, PlanningItemRequest req) {
        item.setTitre(req.getTitre());
        item.setDescription(req.getDescription());
        item.setType(req.getType());
        item.setRefId(req.getRefId());
        item.setLieu(req.getLieu());
        item.setResponsable(req.getResponsable());
        item.setDateDebut(req.getDateDebut());
        item.setDateFin(req.getDateFin());
    }

    private PlanningItem findOrThrow(Long id) {
        return planningRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item introuvable: " + id));
    }

    private PlanningItemDTO toDTO(PlanningItem p) {
        PlanningItemDTO dto = new PlanningItemDTO();
        dto.setId(p.getId());
        dto.setTitre(p.getTitre());
        dto.setDescription(p.getDescription());
        dto.setType(p.getType());
        dto.setRefId(p.getRefId());
        dto.setLieu(p.getLieu());
        dto.setResponsable(p.getResponsable());
        dto.setDateDebut(p.getDateDebut());
        dto.setDateFin(p.getDateFin());
        dto.setCreatedAt(p.getCreatedAt());
        return dto;
    }
}
