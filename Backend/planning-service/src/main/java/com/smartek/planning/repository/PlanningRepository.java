package com.smartek.planning.repository;

import com.smartek.planning.entity.PlanningItem;
import com.smartek.planning.entity.TypeItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface PlanningRepository extends JpaRepository<PlanningItem, Long> {
    List<PlanningItem> findByType(TypeItem type);
    List<PlanningItem> findByDateDebutBetweenOrderByDateDebutAsc(LocalDateTime from, LocalDateTime to);

    @Query("SELECT p FROM PlanningItem p WHERE p.dateDebut >= :from ORDER BY p.dateDebut ASC")
    List<PlanningItem> findUpcoming(LocalDateTime from);
}
