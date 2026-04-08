package com.smartek.cour.repository;

import com.smartek.cour.entity.Chapitre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChapitreRepository extends JpaRepository<Chapitre, Long> {
    List<Chapitre> findByCourIdOrderByOrdreAsc(Long courId);
}
