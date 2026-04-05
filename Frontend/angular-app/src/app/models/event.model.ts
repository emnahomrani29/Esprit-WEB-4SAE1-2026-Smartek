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
