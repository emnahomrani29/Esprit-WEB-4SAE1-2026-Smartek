package com.smartek.certification.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "certifications")
@Data
@NoArgsConstructor
public class Certification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numeroCertificat; // ex: CERT-2026-00001

    private String apprenantId;
    private String apprenantNom;
    private String examenTitre;
    private Long examenId;
    private Integer score;

    @Column(updatable = false)
    private LocalDateTime delivreeLe = LocalDateTime.now();
}
