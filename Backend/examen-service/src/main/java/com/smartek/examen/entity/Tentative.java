package com.smartek.examen.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tentatives")
@Data
@NoArgsConstructor
public class Tentative {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long examenId;
    private String apprenantId;  // userId du learner

    private Integer score;        // score obtenu (%)
    private Boolean reussi = false;

    @ElementCollection
    @CollectionTable(name = "tentative_reponses", joinColumns = @JoinColumn(name = "tentative_id"))
    @Column(name = "reponse_id")
    private List<Long> reponsesChoisies = new ArrayList<>();

    @Column(updatable = false)
    private LocalDateTime passedAt = LocalDateTime.now();
}
