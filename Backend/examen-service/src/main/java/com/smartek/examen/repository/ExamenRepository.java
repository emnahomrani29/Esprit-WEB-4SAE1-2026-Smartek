package com.smartek.examen.repository;

import com.smartek.examen.entity.Examen;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ExamenRepository extends JpaRepository<Examen, Long> {
    Optional<Examen> findByCourId(Long courId);
    List<Examen> findByFormationId(Long formationId);
}
