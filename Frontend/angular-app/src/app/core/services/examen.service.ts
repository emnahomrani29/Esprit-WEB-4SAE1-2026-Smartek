import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReponseDTO { id: number; texte: string; correcte?: boolean; }
export interface QuestionDTO { id: number; enonce: string; points: number; reponses: ReponseDTO[]; }
export interface ExamenDTO {
  id: number; titre: string; description?: string;
  courId?: number; formationId?: number;
  dureeMinutes: number; scoreMinimal: number;
  questions: QuestionDTO[]; createdAt?: string;
}
export interface TentativeDTO {
  id: number; examenId: number; examenTitre: string;
  apprenantId: string; score: number; reussi: boolean;
  reponsesChoisies: number[]; passedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ExamenService {
  private apiUrl = 'http://localhost:8087/api/examens';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ExamenDTO[]> {
    return this.http.get<ExamenDTO[]>(this.apiUrl);
  }

  getById(id: number, showCorrect = false): Observable<ExamenDTO> {
    return this.http.get<ExamenDTO>(`${this.apiUrl}/${id}?showCorrect=${showCorrect}`);
  }

  getByCourId(courId: number, showCorrect = false): Observable<ExamenDTO> {
    return this.http.get<ExamenDTO>(`${this.apiUrl}/cours/${courId}?showCorrect=${showCorrect}`);
  }

  create(data: any): Observable<ExamenDTO> {
    return this.http.post<ExamenDTO>(this.apiUrl, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  passer(examenId: number, apprenantId: string, reponsesChoisies: number[]): Observable<TentativeDTO> {
    return this.http.post<TentativeDTO>(`${this.apiUrl}/${examenId}/passer`, { apprenantId, reponsesChoisies });
  }

  getMesTentatives(apprenantId: string): Observable<TentativeDTO[]> {
    return this.http.get<TentativeDTO[]>(`${this.apiUrl}/tentatives/apprenant/${apprenantId}`);
  }

  getTentativesExamen(examenId: number): Observable<TentativeDTO[]> {
    return this.http.get<TentativeDTO[]>(`${this.apiUrl}/${examenId}/tentatives`);
  }
}
