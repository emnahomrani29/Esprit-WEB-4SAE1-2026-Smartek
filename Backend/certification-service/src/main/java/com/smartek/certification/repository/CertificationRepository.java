package com.smartek.certification.repository;

import com.smartek.certification.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CertificationRepository extends JpaRepository<Certification, Long> {
    List<Certification> findByApprenantId(String apprenantId);
    Optional<Certification> findByExamenIdAndApprenantId(Long examenId, String apprenantId);
    boolean existsByExamenIdAndApprenantId(Long examenId, String apprenantId);
}
