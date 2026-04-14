import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../../core/services/course.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {
  courseForm: FormGroup;
  isEditMode = false;
  courseId: number | null = null;
  loading = false;
  error: string | null = null;

  levels = ['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      trainerId: ['', [Validators.required, Validators.min(1)]],
      duration: ['', [Validators.required, Validators.min(1)]],
      level: ['DEBUTANT', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.courseId = +id;
      this.loadCourse(this.courseId);
    }
  }

  loadCourse(id: number): void {
    this.loading = true;
    this.courseService.getCourseById(id).subscribe({
      next: (course: any) => {
        // Adapter les données
        const adaptedCourse = {
          title: course.title,
          description: course.content || course.description || '',
          trainerId: course.trainerId,
          duration: this.parseDurat
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du cours';
        this.loading = false;
        console.error('Error loading course:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      this.loading = true;
      const courseData = this.courseForm.value;

      const request = this.isEditMode && this.courseId
        ? this.courseService.updateCourse(this.courseId, courseData)
        : this.courseService.createCourse(courseData);

      request.subscribe({
        next: () => {
          this.router.navigate(['/courses']);
        },
        error: (err) => {
          this.error = 'Erreur lors de la sauvegarde du cours';
          this.loading = false;
          console.error('Error saving course:', err);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/courses']);
  }
}
