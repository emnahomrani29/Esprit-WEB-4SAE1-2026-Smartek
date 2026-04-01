import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Examen, StatutExamen } from '../models/examen.model';

@Injectable({
  providedIn: 'root'
})
export class ExamenService {
  // Assuming API Gateway URL, change if direct service call required
  private apiUrl = 'http://localhost:8080/api/examens'; 

  constructor(private http: HttpClient) {}

  getAllExamens(): Observable<Examen[]> {
    return this.http.get<Examen[]>(this.apiUrl);
  }

  getExamenById(id: number): Observable<Examen> {
    return this.http.get<Examen>(`${this.apiUrl}/${id}`);
  }

  createExamen(examen: Examen): Observable<Examen> {
    return this.http.post<Examen>(this.apiUrl, examen);
  }

  updateExamen(id: number, examen: Examen): Observable<Examen> {
    return this.http.put<Examen>(`${this.apiUrl}/${id}`, examen);
  }

  deleteExamen(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getExamensByMatiere(matiere: string): Observable<Examen[]> {
    return this.http.get<Examen[]>(`${this.apiUrl}/matiere/${matiere}`);
  }

  getExamensToday(): Observable<Examen[]> {
    return this.http.get<Examen[]>(`${this.apiUrl}/today`);
  }

  changeStatut(id: number, statut: StatutExamen): Observable<Examen> {
    const params = new HttpParams().set('statut', statut);
    return this.http.patch<Examen>(`${this.apiUrl}/${id}/statut`, {}, { params });
  }
}
