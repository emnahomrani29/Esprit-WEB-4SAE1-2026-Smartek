package com.smartek.cour.repository;

import com.smartek.cour.entity.Cour;
import com.smartek.cour.entity.Niveau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourRepository extends JpaRepository<Cour, Long> {
    List<Cour> findByActifTrue();
    List<Cour> findByCategorie(String categorie);
    List<Cour> findByNiveau(Niveau niveau);
    List<Cour> findByInstructeur(String instructeur);
}
