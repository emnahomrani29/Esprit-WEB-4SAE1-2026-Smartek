CREATE DATABASE IF NOT EXISTS examen_db;
USE examen_db;

-- Assuming Hibernate creates the table automatically, we only need to insert data.
-- If the table is not created by Hibernate, uncomment the following block:
/*
CREATE TABLE IF NOT EXISTS examens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(100) NOT NULL,
    matiere VARCHAR(255) NOT NULL,
    date_examen DATETIME NOT NULL,
    duree INT NOT NULL,
    salle VARCHAR(255) NOT NULL,
    coefficient DOUBLE NOT NULL,
    type_examen VARCHAR(50) NOT NULL,
    statut VARCHAR(50) NOT NULL
);
*/

INSERT INTO examens (titre, matiere, date_examen, duree, salle, coefficient, type_examen, statut) 
VALUES ('Examen Q1 Math', 'Mathématiques', '2026-05-10 09:00:00', 120, 'Amphi A', 3.0, 'CONTROLE', 'PLANIFIE');

INSERT INTO examens (titre, matiere, date_examen, duree, salle, coefficient, type_examen, statut) 
VALUES ('Final Algorithmique', 'Informatique', '2026-05-15 14:00:00', 180, 'Salle 102', 4.0, 'EXAMEN_FINAL', 'PLANIFIE');

INSERT INTO examens (titre, matiere, date_examen, duree, salle, coefficient, type_examen, statut) 
VALUES ('Contrôle Physique', 'Physique', '2026-04-05 10:00:00', 90, 'Amphi B', 2.5, 'CONTROLE', 'TERMINE');

INSERT INTO examens (titre, matiere, date_examen, duree, salle, coefficient, type_examen, statut) 
VALUES ('Rattrapage Chimie', 'Chimie', '2026-06-20 09:00:00', 120, 'Salle 205', 2.0, 'RATTRAPAGE', 'PLANIFIE');

INSERT INTO examens (titre, matiere, date_examen, duree, salle, coefficient, type_examen, statut) 
VALUES ('Examen Mi-Semestre Histoire', 'Histoire', '2026-04-20 14:00:00', 120, 'Amphi C', 2.0, 'CONTROLE', 'PLANIFIE');
