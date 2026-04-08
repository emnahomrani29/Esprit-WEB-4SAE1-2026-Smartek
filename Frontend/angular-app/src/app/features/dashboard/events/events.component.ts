import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { EventService, Event } from '../../../core/services/event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  userRole: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    const userInfo = this.authService.getUserInfo();
    this.userRole = userInfo?.role || '';
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    
    // For learners, show all available events
    // For admin/trainer, show their managed events
    if (this.isLearner()) {
      this.eventService.getAllEvents().subscribe({
        next: (data) => {
          this.events = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading events:', err);
          this.loading = false;
        }
      });
    } else {
      this.eventService.getMyEvents().subscribe({
        next: (data) => {
          this.events = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading events:', err);
          this.loading = false;
        }
      });
    }
  }

  canManageEvents(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'TRAINER';
  }

  isLearner(): boolean {
    return this.userRole === 'LEARNER';
  }

  getEventStats() {
    const total = this.events.length;
    const upcoming = this.events.filter(e => e.status === 'SCHEDULED').length;
    const ongoing = this.events.filter(e => e.status === 'ONGOING').length;
    const completed = this.events.filter(e => e.status === 'COMPLETED').length;
    
    return { total, upcoming, ongoing, completed };
  }

  createEvent(): void {
    this.router.navigate(['/dashboard/events/create']);
  }

  viewEvent(eventId: number): void {
    this.router.navigate(['/dashboard/events', eventId]);
  }

  editEvent(eventId: number): void {
    this.router.navigate(['/dashboard/events', eventId, 'edit']);
  }

  deleteEvent(eventId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          this.loadEvents();
        },
        error: (err) => {
          alert('Erreur lors de la suppression');
          console.error(err);
        }
      });
    }
  }

  registerForEvent(eventId: number): void {
    this.eventService.registerForEvent(eventId).subscribe({
      next: () => {
        alert('Inscription réussie !');
        this.loadEvents();
      },
      error: (err) => {
        alert('Erreur lors de l\'inscription');
        console.error(err);
      }
    });
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
