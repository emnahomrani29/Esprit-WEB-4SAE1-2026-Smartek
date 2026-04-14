import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CourseService } from '../../../core/services/course.service';
import { CourseResponse, ChapterResponse } from '../../../core/models/course.model';

@Component({
  selector: 'app-course-detail-modal',
  templateUrl: './course-detail-modal.component.html',
  styleUrls: ['./course-detail-modal.component.css']
})
export class CourseDetailModalComponent implements OnInit {
  @Input() courseId: number | null = null;
  @Output() close = new EventEmitter<void>();

  course: CourseResponse | null = null;
  chapters: ChapterResponse[] = [];
  loading = false;
  error: string | null = null;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    console.log('Modal ngOnInit - courseId:', this.courseId);
    if (this.courseId) {
      this.loadCourseDetails();
    } else {
      console.error('No courseId provided to modal!');
    }
  }

  loadCourseDetails(): void {
    if (!this.courseId) return;

    console.log('Loading course details for ID:', this.courseId);
    this.loading = true;
    this.error = null;

    this.courseService.getCourseById(this.courseId).subscribe({
      next: (data: any) => {
        console.log('Course details loaded:', data);
        
        // Adapter les données
        this.course = {
          id: data.courseId || data.id,
          title: data.title,
          description: data.content || data.description || 'Pas de description',
          trainerId: data.trainerId,
          duration: this.parseDuration(data.duration),
          level: data.level || 'DEBUTANT',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          message: data.message
        };
        
        console.log('Adapted course:', this.course);
        this.loadChapters();
      },
      error: (err) => {
        console.error('Error loading course details:', err);
        this.error = 'Erreur lors du chargement du cours';
        this.loading = false;
      }
    });
  }

  parseDuration(duration: any): number {
    if (typeof duration === 'number') return duration;
    if (typeof duration === 'string') {
      const match = duration.match(/\d{4}-\d{2}-(\d{2})/);
      if (match) {
        const day = parseInt(match[1], 10);
        return day > 1 ? (day - 1) * 24 : 24;
      }
      const parsed = parseInt(duration, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  loadChapters(): void {
    if (!this.courseId) return;

    console.log('Loading chapters for course ID:', this.courseId);
    this.courseService.getChaptersByCourse(this.courseId).subscribe({
      next: (data) => {
        console.log('Chapters loaded:', data);
        this.chapters = data.sort((a, b) => a.orderIndex - b.orderIndex);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading chapters:', err);
        this.loading = false;
      }
    });
  }

  closeModal(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
