import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, EventParticipant, EventStatus, ParticipantStatus } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8084/api/events';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
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

  updateEventStatus(id: number, status: EventStatus): Observable<Event> {
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
}
