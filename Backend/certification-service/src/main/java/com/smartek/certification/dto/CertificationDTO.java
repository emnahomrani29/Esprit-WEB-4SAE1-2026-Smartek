package com.smartek.certification.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CertificationDTO {
    private Long id;
    private String numeroCertificat;
    private String apprenantId;
    private String apprenantNom;
    private String examenTitre;
    private Long examenId;
    private Integer score;
    private LocalDateTime delivreeLe;
}
