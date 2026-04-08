import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { Event, EventParticipant } from '../../models/event.model';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  participants: EventParticipant[] = [];
  loading = false;
  error: string | null = null;
  isRegistered = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEvent(+id);
      if (this.canViewParticipants()) {
        this.loadParticipants(+id);
      }
      this.checkRegistration(+id);
    }
  }

  loadEvent(id: number): void {
    this.loading = true;
    this.eventService.getEventById(id).subscribe({
      next: (data) => {
        this.event = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Événement non trouvé';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadParticipants(eventId: number): void {
    this.eventService.getEventParticipants(eventId).subscribe({
      next: (data) => {
        this.participants = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des participants', err);
      }
    });
  }

  checkRegistration(eventId: number): void {
    if (this.authService.isAuthenticated()) {
      this.eventService.getMyRegistrations().subscribe({
        next: (registrations) => {
          this.isRegistered = registrations.some(r => r.eventId === eventId);
        },
        error: (err) => {
          console.error('Erreur lors de la vérification de l\'inscription', err);
        }
      });
    }
  }

  registerForEvent(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.event) {
      this.eventService.registerForEvent(this.event.id!).subscribe({
        next: () => {
          alert('Inscription réussie!');
          this.isRegistered = true;
          this.loadEvent(this.event!.id!);
          if (this.canViewParticipants()) {
            this.loadParticipants(this.event!.id!);
          }
        },
        error: (err) => {
          alert('Erreur lors de l\'inscription: ' + (err.error?.message || 'Erreur inconnue'));
          console.error(err);
        }
      });
    }
  }

  cancelRegistration(): void {
    if (this.event && confirm('Êtes-vous sûr de vouloir annuler votre inscription?')) {
      this.eventService.cancelRegistration(this.event.id!).subscribe({
        next: () => {
          alert('Inscription annulée');
          this.isRegistered = false;
          this.loadEvent(this.event!.id!);
          if (this.canViewParticipants()) {
            this.loadParticipants(this.event!.id!);
          }
        },
        error: (err) => {
          alert('Erreur lors de l\'annulation');
          console.error(err);
        }
      });
    }
  }

  canViewParticipants(): boolean {
    return this.authService.isAdmin() || this.authService.isFormateur();
  }

  canRegister(): boolean {
    if (!this.event || this.isRegistered) return false;
    if (this.event.maxParticipants && this.event.currentParticipants! >= this.event.maxParticipants) {
      return false;
    }
    return this.authService.isAuthenticated();
  }

  goBack(): void {
    this.router.navigate(['/events']);
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
