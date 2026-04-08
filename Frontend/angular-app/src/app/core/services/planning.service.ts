import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type TypeItem = 'EVENT' | 'COURS' | 'EXAMEN';

export interface PlanningItemDTO {
  id: number;
  titre: string;
  description?: string;
  type: TypeItem;
  refId?: number;
  lieu?: string;
  responsable?: string;
  dateDebut: string;
  dateFin?: string;
  createdAt?: string;
}

export interface PlanningItemRequest {
  titre: string;
  description?: string;
  type: TypeItem;
  refId?: number;
  lieu?: string;
  responsable?: string;
  dateDebut: string;
  dateFin?: string;
}

@Injectable({ providedIn: 'root' })
export class PlanningService {
  private apiUrl = 'http://localhost:8089/api/planning';

  constructor(private http: HttpClient) {}

  getAll(): Observable<PlanningItemDTO[]> {
    return this.http.get<PlanningItemDTO[]>(this.apiUrl);
  }

  getUpcoming(): Observable<PlanningItemDTO[]> {
    return this.http.get<PlanningItemDTO[]>(`${this.apiUrl}/upcoming`);
  }

  getByType(type: TypeItem): Observable<PlanningItemDTO[]> {
    return this.http.get<PlanningItemDTO[]>(`${this.apiUrl}/type/${type}`);
  }

  create(data: PlanningItemRequest): Observable<PlanningItemDTO> {
    return this.http.post<PlanningItemDTO>(this.apiUrl, data);
  }

  update(id: number, data: PlanningItemRequest): Observable<PlanningItemDTO> {
    return this.http.put<PlanningItemDTO>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
