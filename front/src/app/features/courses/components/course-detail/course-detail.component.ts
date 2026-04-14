import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../../core/services/course.service';
import { CourseResponse, ChapterResponse } from '../../../../core/models/course.model';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  course: CourseResponse | null = null;
  chapters: ChapterResponse[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCourse(+id);
      this.loadChapters(+id);
    }
  }

  loadCourse(id: number): void {
    this.loading = true;
    this.courseService.getCourseById(id).subscribe({
      next: (data) => {
        this.course = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du cours';
        this.loading = false;
        console.error('Error loading course:', err);
      }
    });
  }

  loadChapters(courseId: number): void {
    this.courseService.getChaptersByCourse(courseId).subscribe({
      next: (data) => {
        this.chapters = data.sort((a, b) => a.orderIndex - b.orderIndex);
      },
      error: (err) => {
        console.error('Error loading chapters:', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/courses']);
  }

  editCourse(): void {
    if (this.course) {
      this.router.navigate(['/courses', this.course.id, 'edit']);
    }
  }
}
