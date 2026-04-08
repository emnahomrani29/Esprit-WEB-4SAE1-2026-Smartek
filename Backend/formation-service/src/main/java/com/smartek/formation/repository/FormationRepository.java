package com.smartek.formation.repository;

import com.smartek.formation.entity.Formation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FormationRepository extends JpaRepository<Formation, Long> {
    List<Formation> findByActifTrue();
}
