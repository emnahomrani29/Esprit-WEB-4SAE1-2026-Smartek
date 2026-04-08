import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Formation {
  id?: number;
  titre: string;
  description?: string;
  categorie?: string;
  niveau?: string;
  duree?: string;
  actif?: boolean;
  courIds?: number[];
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class FormationService {
  private apiUrl = 'http://localhost:8086/api/formations';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.apiUrl);
  }

  getById(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Formation>): Observable<Formation> {
    return this.http.post<Formation>(this.apiUrl, data);
  }

  update(id: number, data: Partial<Formation>): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addCour(formationId: number, courId: number): Observable<Formation> {
    return this.http.post<Formation>(`${this.apiUrl}/${formationId}/cours/${courId}`, {});
  }

  removeCour(formationId: number, courId: number): Observable<Formation> {
    return this.http.delete<Formation>(`${this.apiUrl}/${formationId}/cours/${courId}`);
  }
}
