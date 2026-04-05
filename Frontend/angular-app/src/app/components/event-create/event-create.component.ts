import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event, EventType } from '../../models/event.model';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent {
  event: Event = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    eventType: EventType.WEBINAR,
    maxParticipants: undefined
  };

  eventTypes = Object.values(EventType);
  loading = false;
  error: string | null = null;

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.error = null;

    this.eventService.createEvent(this.event).subscribe({
      next: () => {
        alert('Événement créé avec succès!');
        this.router.navigate(['/events']);
      },
      error: (err) => {
        this.error = 'Erreur lors de la création de l\'événement';
        this.loading = false;
        console.error(err);
      }
    });
  }

  cancel(): void {
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
}
