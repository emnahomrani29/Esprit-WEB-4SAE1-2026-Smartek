package com.smartek.examen.service;

import com.smartek.examen.dto.*;
import com.smartek.examen.entity.*;
import com.smartek.examen.repository.ExamenRepository;
import com.smartek.examen.repository.TentativeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamenService {

    private final ExamenRepository examenRepository;
    private final TentativeRepository tentativeRepository;

    // ── CRUD Examen ────────────────────────────────────────
    @Transactional
    public ExamenDTO create(ExamenRequest req) {
        Examen examen = new Examen();
        examen.setTitre(req.getTitre());
        examen.setDescription(req.getDescription());
        examen.setCourId(req.getCourId());
        examen.setFormationId(req.getFormationId());
        examen.setDureeMinutes(req.getDureeMinutes() != null ? req.getDureeMinutes() : 60);
        examen.setScoreMinimal(req.getScoreMinimal() != null ? req.getScoreMinimal() : 50);

        if (req.getQuestions() != null) {
            for (ExamenRequest.QuestionRequest qr : req.getQuestions()) {
                Question q = new Question();
                q.setEnonce(qr.getEnonce());
                q.setPoints(qr.getPoints() != null ? qr.getPoints() : 1);
                q.setExamen(examen);
                if (qr.getReponses() != null) {
                    for (ExamenRequest.ReponseRequest rr : qr.getReponses()) {
                        Reponse r = new Reponse();
                        r.setTexte(rr.getTexte());
                        r.setCorrecte(rr.getCorrecte() != null ? rr.getCorrecte() : false);
                        r.setQuestion(q);
                        q.getReponses().add(r);
                    }
                }
                examen.getQuestions().add(q);
            }
        }
        return toDTO(examenRepository.save(examen), true);
    }

    public List<ExamenDTO> getAll() {
        return examenRepository.findAll().stream()
                .map(e -> toDTO(e, true)).collect(Collectors.toList());
    }

    public ExamenDTO getById(Long id, boolean showCorrect) {
        return toDTO(findOrThrow(id), showCorrect);
    }

    public ExamenDTO getByCourId(Long courId, boolean showCorrect) {
        Examen e = examenRepository.findByCourId(courId)
                .orElseThrow(() -> new EntityNotFoundException("Aucun examen pour ce cours"));
        return toDTO(e, showCorrect);
    }

    public List<ExamenDTO> getByFormationId(Long formationId) {
        return examenRepository.findByFormationId(formationId).stream()
                .map(e -> toDTO(e, true)).collect(Collectors.toList());
    }

    public void delete(Long id) {
        examenRepository.deleteById(id);
    }

    // ── Passer un examen ───────────────────────────────────
    @Transactional
    public TentativeDTO passer(Long examenId, TentativeRequest req) {
        Examen examen = findOrThrow(examenId);

        // Calculer le score
        int totalPoints = examen.getQuestions().stream().mapToInt(Question::getPoints).sum();
        int pointsObtenus = 0;

        for (Question q : examen.getQuestions()) {
            List<Long> correctIds = q.getReponses().stream()
                    .filter(Reponse::getCorrecte).map(Reponse::getId).collect(Collectors.toList());
            List<Long> chosen = req.getReponsesChoisies().stream()
                    .filter(correctIds::contains).collect(Collectors.toList());
            if (!chosen.isEmpty() && chosen.size() == correctIds.size()) {
                pointsObtenus += q.getPoints();
            }
        }

        int score = totalPoints > 0 ? (pointsObtenus * 100 / totalPoints) : 0;
        boolean reussi = score >= examen.getScoreMinimal();

        Tentative t = new Tentative();
        t.setExamenId(examenId);
        t.setApprenantId(req.getApprenantId());
        t.setScore(score);
        t.setReussi(reussi);
        t.setReponsesChoisies(req.getReponsesChoisies());

        TentativeDTO result = toTentativeDTO(tentativeRepository.save(t), examen.getTitre());

        // Appeler certification-service si réussi
        if (reussi) {
            try {
                org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
                java.util.Map<String, Object> certReq = new java.util.HashMap<>();
                certReq.put("apprenantId", req.getApprenantId());
                certReq.put("apprenantNom", req.getApprenantId());
                certReq.put("examenTitre", examen.getTitre());
                certReq.put("examenId", examenId);
                certReq.put("score", score);
                restTemplate.postForObject("http://localhost:8088/api/certifications", certReq, Object.class);
            } catch (Exception e) {
                // Ne pas bloquer si certification-service est indisponible
            }
        }

        return result;
    }

    public List<TentativeDTO> getTentativesByApprenant(String apprenantId) {
        return tentativeRepository.findByApprenantId(apprenantId).stream()
                .map(t -> {
                    String titre = examenRepository.findById(t.getExamenId())
                            .map(Examen::getTitre).orElse("Examen #" + t.getExamenId());
                    return toTentativeDTO(t, titre);
                }).collect(Collectors.toList());
    }

    public List<TentativeDTO> getTentativesByExamen(Long examenId) {
        String titre = findOrThrow(examenId).getTitre();
        return tentativeRepository.findByExamenId(examenId).stream()
                .map(t -> toTentativeDTO(t, titre)).collect(Collectors.toList());
    }

    // ── Mappers ────────────────────────────────────────────
    private Examen findOrThrow(Long id) {
        return examenRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Examen introuvable: " + id));
    }

    private ExamenDTO toDTO(Examen e, boolean showCorrect) {
        ExamenDTO dto = new ExamenDTO();
        dto.setId(e.getId());
        dto.setTitre(e.getTitre());
        dto.setDescription(e.getDescription());
        dto.setCourId(e.getCourId());
        dto.setFormationId(e.getFormationId());
        dto.setDureeMinutes(e.getDureeMinutes());
        dto.setScoreMinimal(e.getScoreMinimal());
        dto.setCreatedAt(e.getCreatedAt());
        dto.setQuestions(e.getQuestions().stream().map(q -> {
            QuestionDTO qd = new QuestionDTO();
            qd.setId(q.getId());
            qd.setEnonce(q.getEnonce());
            qd.setPoints(q.getPoints());
            qd.setReponses(q.getReponses().stream().map(r -> {
                ReponseDTO rd = new ReponseDTO();
                rd.setId(r.getId());
                rd.setTexte(r.getTexte());
                rd.setCorrecte(showCorrect ? r.getCorrecte() : null);
                return rd;
            }).collect(Collectors.toList()));
            return qd;
        }).collect(Collectors.toList()));
        return dto;
    }

    private TentativeDTO toTentativeDTO(Tentative t, String examenTitre) {
        TentativeDTO dto = new TentativeDTO();
        dto.setId(t.getId());
        dto.setExamenId(t.getExamenId());
        dto.setExamenTitre(examenTitre);
        dto.setApprenantId(t.getApprenantId());
        dto.setScore(t.getScore());
        dto.setReussi(t.getReussi());
        dto.setReponsesChoisies(t.getReponsesChoisies());
        dto.setPassedAt(t.getPassedAt());
        return dto;
    }
}
