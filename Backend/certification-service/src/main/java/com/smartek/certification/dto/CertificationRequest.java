package com.smartek.certification.dto;

import lombok.Data;

@Data
public class CertificationRequest {
    private String apprenantId;
    private String apprenantNom;
    private String examenTitre;
    private Long examenId;
    private Integer score;
}
