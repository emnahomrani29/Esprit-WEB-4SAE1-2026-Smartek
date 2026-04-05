import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService, Event, EventType } from '../../../../core/services/event.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  loading = false;
  error: string | null = null;
  isEditMode = false;
  eventId: number | null = null;
  eventTypes = Object.values(EventType);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      location: ['', [Validators.required]],
      eventType: [EventType.WEBINAR, [Validators.required]],
      maxParticipants: [null, [Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.params['id'];
    if (this.eventId) {
      this.isEditMode = true;
      this.loadEvent(this.eventId);
    }
  }

  loadEvent(id: number): void {
    this.loading = true;
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.eventForm.patchValue({
          title: event.title,
          description: event.description,
          startDate: this.formatDateForInput(event.startDate),
          endDate: this.formatDateForInput(event.endDate),
          location: event.location,
          eventType: event.eventType,
          maxParticipants: event.maxParticipants
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de l\'événement';
        this.loading = false;
        console.error(err);
      }
    });
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  onSubmit(): void {
    if (this.eventForm.valid && !this.loading) {
      this.loading = true;
      this.error = null;

      const eventData: Event = {
        ...this.eventForm.value,
        startDate: new Date(this.eventForm.value.startDate).toISOString(),
        endDate: new Date(this.eventForm.value.endDate).toISOString()
      };

      const request = this.isEditMode && this.eventId
        ? this.eventService.updateEvent(this.eventId, eventData)
        : this.eventService.createEvent(eventData);

      request.subscribe({
        next: () => {
          this.router.navigate(['/dashboard/events']);
        },
        error: (err) => {
          this.error = 'Erreur lors de l\'enregistrement de l\'événement';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard/events']);
  }

  getEventTypeLabel(type: string): string {
    return this.eventService.getEventTypeLabel(type);
  }
}
