import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CertificationDTO {
  id: number;
  numeroCertificat: string;
  apprenantId: string;
  apprenantNom: string;
  examenTitre: string;
  examenId: number;
  score: number;
  delivreeLe: string;
}

@Injectable({ providedIn: 'root' })
export class CertificationService {
  private apiUrl = 'http://localhost:8088/api/certifications';

  constructor(private http: HttpClient) {}

  getMesCertifications(apprenantId: string): Observable<CertificationDTO[]> {
    return this.http.get<CertificationDTO[]>(`${this.apiUrl}/apprenant/${apprenantId}`);
  }

  getAll(): Observable<CertificationDTO[]> {
    return this.http.get<CertificationDTO[]>(this.apiUrl);
  }

  downloadPdf(id: number): void {
    window.open(`${this.apiUrl}/${id}/pdf`, '_blank');
  }
}
