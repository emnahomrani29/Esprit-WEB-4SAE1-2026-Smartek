package com.smartek.examen.repository;

import com.smartek.examen.entity.Tentative;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TentativeRepository extends JpaRepository<Tentative, Long> {
    List<Tentative> findByApprenantId(String apprenantId);
    List<Tentative> findByExamenId(Long examenId);
    Optional<Tentative> findByExamenIdAndApprenantId(Long examenId, String apprenantId);
}
