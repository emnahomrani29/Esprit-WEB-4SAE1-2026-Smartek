package com.esprit.examen.repositories;

import com.esprit.examen.entities.Examen;
import com.esprit.examen.entities.StatutExamen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository pour l'entité Examen.
 */
@Repository
public interface ExamenRepository extends JpaRepository<Examen, Long> {
    
    // Trouver par matière
    List<Examen> findByMatiere(String matiere);
    
    // Trouver par plage de dates
    List<Examen> findByDateExamenBetween(LocalDateTime start, LocalDateTime end);
    
    // Trouver par statut
    List<Examen> findByStatut(StatutExamen statut);
}
