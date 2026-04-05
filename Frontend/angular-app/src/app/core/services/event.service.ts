import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
  id?: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  eventType: EventType;
  status?: EventStatus;
  organizerId?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  createdAt?: string;
  updatedAt?: string;
}

export enum EventType {
  WEBINAR = 'WEBINAR',
  WORKSHOP = 'WORKSHOP',
  CONFERENCE = 'CONFERENCE',
  TRAINING = 'TRAINING',
  CERTIFICATION_EXAM = 'CERTIFICATION_EXAM',
  NETWORKING = 'NETWORKING',
  OTHER = 'OTHER'
}

export enum EventStatus {
  SCHEDULED = 'SCHEDULED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  POSTPONED = 'POSTPONED'
}

export interface EventParticipant {
  id?: number;
  eventId: number;
  userId: string;
  status: ParticipantStatus;
  registeredAt?: string;
}

export enum ParticipantStatus {
  REGISTERED = 'REGISTERED',
  ATTENDED = 'ATTENDED',
  ABSENT = 'ABSENT',
  CANCELLED = 'CANCELLED'
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8084/api/events';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Event endpoints
  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event, { headers: this.getHeaders() });
  }

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getUpcomingEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/public/upcoming`);
  }

  getMyEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/organizer/my-events`, { headers: this.getHeaders() });
  }

  updateEvent(id: number, event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, event, { headers: this.getHeaders() });
  }

  updateEventStatus(id: number, status: EventStatus | string): Observable<Event> {
    return this.http.patch<Event>(`${this.apiUrl}/${id}/status?status=${status}`, {}, { headers: this.getHeaders() });
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Participant endpoints
  registerForEvent(eventId: number): Observable<EventParticipant> {
    return this.http.post<EventParticipant>(`${this.apiUrl}/${eventId}/register`, {}, { headers: this.getHeaders() });
  }

  cancelRegistration(eventId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}/cancel`, { headers: this.getHeaders() });
  }

  getEventParticipants(eventId: number): Observable<EventParticipant[]> {
    return this.http.get<EventParticipant[]>(`${this.apiUrl}/${eventId}/participants`, { headers: this.getHeaders() });
  }

  getMyRegistrations(): Observable<EventParticipant[]> {
    return this.http.get<EventParticipant[]>(`${this.apiUrl}/my-registrations`, { headers: this.getHeaders() });
  }

  updateParticipantStatus(eventId: number, userId: string, status: ParticipantStatus): Observable<EventParticipant> {
    return this.http.patch<EventParticipant>(
      `${this.apiUrl}/${eventId}/participants/${userId}/status?status=${status}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  // Helper methods
  getEventTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'WEBINAR': 'Webinaire',
      'WORKSHOP': 'Atelier',
      'CONFERENCE': 'Conférence',
      'TRAINING': 'Formation',
      'CERTIFICATION_EXAM': 'Examen',
      'NETWORKING': 'Réseautage',
      'OTHER': 'Autre'
    };
    return labels[type] || type;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'SCHEDULED': 'Planifié',
      'ONGOING': 'En cours',
      'COMPLETED': 'Terminé',
      'CANCELLED': 'Annulé',
      'POSTPONED': 'Reporté'
    };
    return labels[status] || status;
  }
}
