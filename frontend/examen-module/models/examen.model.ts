export enum TypeExamen {
    CONTROLE = 'CONTROLE',
    EXAMEN_FINAL = 'EXAMEN_FINAL',
    RATTRAPAGE = 'RATTRAPAGE'
}

export enum StatutExamen {
    PLANIFIE = 'PLANIFIE',
    EN_COURS = 'EN_COURS',
    TERMINE = 'TERMINE',
    ANNULE = 'ANNULE'
}

export interface Examen {
    id?: number;
    titre: string;
    matiere: string;
    dateExamen: string; // ISO format string
    duree: number;
    salle: string;
    coefficient: number;
    typeExamen: TypeExamen;
    statut: StatutExamen;
}
