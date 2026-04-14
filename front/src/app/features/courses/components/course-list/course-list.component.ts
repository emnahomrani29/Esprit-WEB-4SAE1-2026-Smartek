import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../../../../core/services/course.service';
import { CourseResponse } from '../../../../core/models/course.model';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses: CourseResponse[] = [];
  loading = false;
  error: string | null = null;
  selectedCourseId: number | null = null;
  showModal = false;

  constructor(
    private courseService: CourseService,
    private router: Router
  ) {
    console.log('CourseListComponent constructor called');
  }

  ngOnInit(): void {
    console.log('CourseListComponent ngOnInit called');
    this.loadCourses();
  }

  loadCourses(): void {
    console.log('Loading courses...');
    this.loading = true;
    this.error = null;
    
    this.courseService.getAllCourses().subscribe({
      next: (data: any) => {
        console.log('=== API RESPONSE DEBUG ===');
        console.log('Raw data:', data);
        
        // Adapter les données de l'API vers le format attendu
        this.courses = data.map((course: any) => ({
          id: course.courseId || course.id,
          title: course.title,
          description: course.content || course.description || 'Pas de description',
          trainerId: course.trainerId,
          duration: this.parseDuration(course.duration),
          level: course.level || 'DEBUTANT',
          createdAt: course.createdAt,
          updatedAt: course.updatedAt,
          message: course.message
        }));
        
        console.log('Adapted courses:', this.courses);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.error = 'Erreur lors du chargement des cours';
        this.loading = false;
      }
    });
  }

  // Convertir la durée de format date vers nombre d'heures
  parseDuration(duration: any): number {
    if (typeof duration === 'number') return duration;
    if (typeof duration === 'string') {
      // Si c'est une date comme "1970-01-02", extraire le jour comme nombre d'heures
      const match = duration.match(/\d{4}-\d{2}-(\d{2})/);
      if (match) {
        const day = parseInt(match[1], 10);
        return day > 1 ? (day - 1) * 24 : 24; // Convertir jours en heures
      }
      // Sinon essayer de parser comme nombre
      const parsed = parseInt(duration, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  viewCourse(id: number): void {
    console.log('=== viewCourse CALLED ===');
    console.log('Opening modal for course ID:', id);
    this.selectedCourseId = id;
    this.showModal = true;
  }

  viewCourseByIndex(index: number): void {
    console.log('=== viewCourseByIndex CALLED ===');
    console.log('Index:', index);
    const course: any = this.courses[index];
    console.log('Course:', course);
    
    // Essayer de trouver l'ID dans différentes propriétés possibles
    const id = course.id || course.courseId || course.Id || (index + 1);
    console.log('Using ID:', id);
    
    this.selectedCourseId = id;
    this.showModal = true;
  }

  closeModal(): void {
    console.log('Closing modal');
    this.showModal = false;
    this.selectedCourseId = null;
  }

  editCourse(id: number): void {
    console.log('=== editCourse CALLED ===');
    console.log('Navigating to edit form for ID:', id);
    this.router.navigate(['/courses', id, 'edit']);
  }

  editCourseByIndex(index: number): void {
    console.log('=== editCourseByIndex CALLED ===');
    console.log('Index:', index);
    const course: any = this.courses[index];
    console.log('Course:', course);
    
    // Essayer de trouver l'ID dans différentes propriétés possibles
    const id = course.id || course.courseId || course.Id || (index + 1);
    console.log('Using ID:', id);
    
    this.router.navigate(['/courses', id, 'edit']);
  }

  deleteCourse(id: number): void {
    console.log('=== deleteCourse CALLED ===');
    console.log('Deleting course ID:', id);
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      console.log('Delete confirmed');
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          console.log('Course deleted successfully');
          this.loadCourses();
        },
        error: (err) => {
          console.error('Error deleting course:', err);
          this.error = 'Erreur lors de la suppression du cours';
        }
      });
    } else {
      console.log('Delete cancelled');
    }
  }

  deleteCourseByIndex(index: number): void {
    console.log('=== deleteCourseByIndex CALLED ===');
    console.log('Index:', index);
    const course: any = this.courses[index];
    console.log('Course:', course);
    
    // Essayer de trouver l'ID dans différentes propriétés possibles
    const id = course.id || course.courseId || course.Id;
    console.log('Using ID:', id);
    
    if (!id) {
      alert('Impossible de supprimer : ID du cours introuvable');
      return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      console.log('Delete confirmed');
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          console.log('Course deleted successfully');
          alert('Cours supprimé avec succès!');
          this.loadCourses();
        },
        error: (err) => {
          console.error('Error deleting course:', err);
          this.error = 'Erreur lors de la suppression du cours';
          alert('Erreur: ' + err.message);
        }
      });
    } else {
      console.log('Delete cancelled');
    }
  }

  createCourse(): void {
    console.log('=== createCourse CALLED ===');
    console.log('Navigating to create form');
    this.router.navigate(['/courses/new']);
  }
}
