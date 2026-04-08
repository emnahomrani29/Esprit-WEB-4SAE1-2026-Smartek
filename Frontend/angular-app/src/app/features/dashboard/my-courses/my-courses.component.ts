import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.scss'
})
export class MyCoursesComponent implements OnInit {
  courses: Course[] = [];
  isLoading = false;
  selectedCourse: Course | null = null;
  loadingChapters = false;
  chapters: any[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.courseService.getActiveCourses().subscribe({
      next: (data) => { this.courses = data; this.isLoading = false; },
      error: (err) => { console.error(err); this.isLoading = false; }
    });
  }

  viewCourse(course: Course): void {
    this.selectedCourse = course;
    this.chapters = [];
    this.loadingChapters = true;
    this.courseService.getChapitres(course.id!).subscribe({
      next: (data) => { this.chapters = data; this.loadingChapters = false; },
      error: () => { this.loadingChapters = false; }
    });
  }

  getNiveauClass(niveau: string | undefined): string {
    const map: Record<string, string> = {
      'DEBUTANT': 'bg-green-100 text-green-700',
      'INTERMEDIAIRE': 'bg-yellow-100 text-yellow-700',
      'AVANCE': 'bg-red-100 text-red-700'
    };
    return map[niveau || ''] || 'bg-gray-100 text-gray-600';
  }
}
