import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private eventService: EventService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.error = null;

    if (this.authService.isAuthenticated()) {
      this.eventService.getAllEvents().subscribe({
        next: (data) => {
          this.events = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des événements';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.eventService.getUpcomingEvents().subscribe({
        next: (data) => {
          this.events = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des événements';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  registerForEvent(eventId: number): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.eventService.registerForEvent(eventId).subscribe({
      next: () => {
        alert('Inscription réussie!');
        this.loadEvents();
      },
      error: (err) => {
        alert('Erreur lors de l\'inscription: ' + (err.error?.message || 'Erreur inconnue'));
        console.error(err);
      }
    });
  }

  viewEventDetails(eventId: number): void {
    this.router.navigate(['/events', eventId]);
  }

  createEvent(): void {
    this.router.navigate(['/events/create']);
  }

  canCreateEvent(): boolean {
    return this.authService.isAdmin() || this.authService.isFormateur();
  }

  getEventTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'WEBINAR': 'Webinaire',
      'WORKSHOP': 'Atelier',
      'CONFERENCE': 'Conférence',
      'TRAINING': 'Formation',
      'CERTIFICATION_EXAM': 'Examen de certification',
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

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'SCHEDULED': 'badge-info',
      'ONGOING': 'badge-success',
      'COMPLETED': 'badge-secondary',
      'CANCELLED': 'badge-danger',
      'POSTPONED': 'badge-warning'
    };
    return classes[status] || 'badge-secondary';
  }
}
