export type Niveau = 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE';

// Modèle aligné sur le backend cour-service
export interface Course {
  // Champs backend cour-service
  id?: number;
  titre?: string;
  description?: string;
  categorie?: string;
  niveau?: Niveau;
  dureeHeures?: number;
  instructeur?: string;
  prix?: number;
  actif?: boolean;
  createdAt?: string;
  updatedAt?: string;

  // Anciens champs pour compatibilité avec les autres composants
  courseId?: number;
  title?: string;
  content?: string;
  duration?: string;
  trainerId?: number;
  chapters?: any[];
}

export interface CourseDetail {
  id?: number;
  title?: string;
  description?: string;
  image?: string;
  duration?: string;
  lessons?: number;
  students?: number;
  rating?: number;
  price?: number;
  instructor?: string;
  category?: string;
  course?: string;
  imageSrc?: string;
  profession?: string;
}

export interface CourseCreateRequest {
  titre: string;
  description?: string;
  categorie: string;
  niveau: Niveau;
  dureeHeures: number;
  instructeur?: string;
  prix?: number;
  actif?: boolean;
}

export interface CourseUpdateRequest extends CourseCreateRequest {}
