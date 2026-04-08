package com.smartek.certification.service;

import com.smartek.certification.dto.CertificationDTO;
import com.smartek.certification.dto.CertificationRequest;
import com.smartek.certification.entity.Certification;
import com.smartek.certification.repository.CertificationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificationService {

    private final CertificationRepository certificationRepository;

    public CertificationDTO creer(CertificationRequest req) {
        // Éviter les doublons
        if (certificationRepository.existsByExamenIdAndApprenantId(req.getExamenId(), req.getApprenantId())) {
            return toDTO(certificationRepository
                    .findByExamenIdAndApprenantId(req.getExamenId(), req.getApprenantId()).get());
        }

        Certification cert = new Certification();
        cert.setApprenantId(req.getApprenantId());
        cert.setApprenantNom(req.getApprenantNom() != null ? req.getApprenantNom() : req.getApprenantId());
        cert.setExamenTitre(req.getExamenTitre());
        cert.setExamenId(req.getExamenId());
        cert.setScore(req.getScore());
        cert.setNumeroCertificat(genererNumero());

        return toDTO(certificationRepository.save(cert));
    }

    public List<CertificationDTO> getByApprenant(String apprenantId) {
        return certificationRepository.findByApprenantId(apprenantId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<CertificationDTO> getAll() {
        return certificationRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Certification getEntityById(Long id) {
        return certificationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Certification introuvable: " + id));
    }

    private String genererNumero() {
        long count = certificationRepository.count() + 1;
        return String.format("CERT-%d-%05d", LocalDateTime.now().getYear(), count);
    }

    private CertificationDTO toDTO(Certification c) {
        CertificationDTO dto = new CertificationDTO();
        dto.setId(c.getId());
        dto.setNumeroCertificat(c.getNumeroCertificat());
        dto.setApprenantId(c.getApprenantId());
        dto.setApprenantNom(c.getApprenantNom());
        dto.setExamenTitre(c.getExamenTitre());
        dto.setExamenId(c.getExamenId());
        dto.setScore(c.getScore());
        dto.setDelivreeLe(c.getDelivreeLe());
        return dto;
    }
}
