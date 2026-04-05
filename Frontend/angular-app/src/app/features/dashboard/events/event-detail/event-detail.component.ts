import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService, Event, EventParticipant, EventStatus, ParticipantStatus } from '../../../../core/services/event.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  participants: EventParticipant[] = [];
  loading = false;
  error: string | null = null;
  isRegistered = false;
  userRole: string = '';
  currentUserId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userInfo = this.authService.getUserInfo();
    this.userRole = userInfo?.role || '';
    this.currentUserId = userInfo?.userId?.toString() || '';
    
    const id = this.route.snapshot.params['id'];
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
    this.eventService.getMyRegistrations().subscribe({
      next: (registrations) => {
        this.isRegistered = registrations.some(r => r.eventId === eventId);
      },
      error: (err) => {
        console.error('Erreur lors de la vérification de l\'inscription', err);
      }
    });
  }

  registerForEvent(): void {
    if (this.event) {
      this.eventService.registerForEvent(this.event.id!).subscribe({
        next: () => {
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

  editEvent(): void {
    this.router.navigate(['/dashboard/events', this.event?.id, 'edit']);
  }

  deleteEvent(): void {
    if (this.event && confirm('Êtes-vous sûr de vouloir supprimer cet événement?')) {
      this.eventService.deleteEvent(this.event.id!).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/events']);
        },
        error: (err) => {
          alert('Erreur lors de la suppression');
          console.error(err);
        }
      });
    }
  }

  updateEventStatus(status: EventStatus): void {
    if (this.event) {
      this.eventService.updateEventStatus(this.event.id!, status).subscribe({
        next: (updated) => {
          this.event = updated;
        },
        error: (err) => {
          alert('Erreur lors de la mise à jour du statut');
          console.error(err);
        }
      });
    }
  }

  // Expose EventStatus enum to template
  EventStatus = EventStatus;

  canViewParticipants(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'TRAINER';
  }

  canManageEvent(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'TRAINER';
  }

  canRegister(): boolean {
    if (!this.event || this.isRegistered) return false;
    if (this.event.maxParticipants && this.event.currentParticipants! >= this.event.maxParticipants) {
      return false;
    }
    return true;
  }

  goBack(): void {
    this.router.navigate(['/dashboard/events']);
  }

  getEventTypeLabel(type: string): string {
    return this.eventService.getEventTypeLabel(type);
  }

  getStatusLabel(status: string): string {
    return this.eventService.getStatusLabel(status);
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'SCHEDULED': 'bg-info',
      'ONGOING': 'bg-success',
      'COMPLETED': 'bg-secondary',
      'CANCELLED': 'bg-danger',
      'POSTPONED': 'bg-warning'
    };
    return classes[status] || 'bg-secondary';
  }
}
