import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course, CourseCreateRequest } from '../../../core/models/course.model';

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './course-management.component.html',
  styleUrl: './course-management.component.scss'
})
export class CourseManagementComponent implements OnInit {
  courses: Course[] = [];
  courseForm: FormGroup;
  isEditMode = false;
  selectedCourseId: number | null = null;
  showModal = false;
  loading = false;

  // Détails + chapitres
  showDetailsModal = false;
  detailsCourse: Course | null = null;
  chapitres: any[] = [];
  loadingChapitres = false;
  showAddChapitreForm = false;
  newChapitre = { titre: '', description: '', ordre: 1 };

  // Chapitres à créer avec le cours
  chapitresForm: { titre: string; description: string; ordre: number }[] = [];

  niveaux = ['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE'];
  categories = [
    'Informatique',
    'Développement Web',
    'Développement Mobile',
    'Intelligence Artificielle',
    'Data Science',
    'Cybersécurité',
    'Cloud Computing',
    'DevOps',
    'Design',
    'Marketing Digital',
    'Gestion de Projet',
    'Langues',
    'Autre'
  ];

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private authService: AuthService
  ) {
    this.courseForm = this.fb.group({
      titre: ['', [Validators.required, Validators.maxLength(200)]],
      description: [''],
      categorie: ['', Validators.required],
      niveau: ['DEBUTANT', Validators.required],
      dureeHeures: [1, [Validators.required, Validators.min(1)]],
      instructeur: [''],
      prix: [0],
      actif: [true]
    });
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.courseService.getAllCourses().subscribe({
      next: (courses) => { this.courses = courses; this.loading = false; },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedCourseId = null;
    this.chapitresForm = [];
    this.courseForm.reset({ niveau: 'DEBUTANT', dureeHeures: 1, prix: 0, actif: true });
    this.showModal = true;
  }

  openEditModal(course: Course): void {
    this.isEditMode = true;
    this.selectedCourseId = course.id || null;
    this.chapitresForm = [];
    this.courseForm.patchValue(course);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.chapitresForm = [];
    this.courseForm.reset();
  }

  // ── Chapitres dans le formulaire ──────────────────────
  addChapitreRow(): void {
    this.chapitresForm.push({ titre: '', description: '', ordre: this.chapitresForm.length + 1 });
  }

  removeChapitreRow(index: number): void {
    this.chapitresForm.splice(index, 1);
    this.chapitresForm.forEach((ch, i) => ch.ordre = i + 1);
  }

  onSubmit(): void {
    if (this.courseForm.invalid) return;
    this.loading = true;
    const data: CourseCreateRequest = this.courseForm.value;

    const request$ = this.isEditMode && this.selectedCourseId
      ? this.courseService.updateCourse(this.selectedCourseId, data)
      : this.courseService.createCourse(data);

    request$.subscribe({
      next: (course) => {
        // Créer les chapitres si présents
        const validChapitres = this.chapitresForm.filter(ch => ch.titre.trim());
        if (validChapitres.length > 0 && course.id) {
          let done = 0;
          validChapitres.forEach(ch => {
            this.courseService.createChapitre(course.id!, ch).subscribe({
              next: () => {
                done++;
                if (done === validChapitres.length) {
                  this.loadCourses();
                  this.closeModal();
                  this.loading = false;
                }
              },
              error: () => { done++; if (done === validChapitres.length) { this.loadCourses(); this.closeModal(); this.loading = false; } }
            });
          });
        } else {
          this.loadCourses();
          this.closeModal();
          this.loading = false;
        }
      },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  deleteCourse(id: number): void {
    if (confirm('Supprimer ce cours ?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => this.loadCourses(),
        error: (err) => console.error(err)
      });
    }
  }

  // ── Modal Détails ──────────────────────────────────────
  openDetailsModal(course: Course): void {
    this.detailsCourse = course;
    this.showDetailsModal = true;
    this.showAddChapitreForm = false;
    this.newChapitre = { titre: '', description: '', ordre: 1 };
    this.loadChapitres(course.id!);
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.detailsCourse = null;
    this.chapitres = [];
  }

  loadChapitres(courId: number): void {
    this.loadingChapitres = true;
    this.courseService.getChapitres(courId).subscribe({
      next: (data) => { this.chapitres = data; this.loadingChapitres = false; },
      error: () => { this.loadingChapitres = false; }
    });
  }

  saveChapitre(): void {
    if (!this.newChapitre.titre.trim() || !this.detailsCourse?.id) return;
    this.courseService.createChapitre(this.detailsCourse.id, this.newChapitre).subscribe({
      next: () => {
        this.loadChapitres(this.detailsCourse!.id!);
        this.newChapitre = { titre: '', description: '', ordre: this.chapitres.length + 2 };
        this.showAddChapitreForm = false;
      },
      error: (err) => console.error(err)
    });
  }

  deleteChapitre(chapitreId: number): void {
    if (!this.detailsCourse?.id || !confirm('Supprimer ce chapitre ?')) return;
    this.courseService.deleteChapitre(this.detailsCourse.id, chapitreId).subscribe({
      next: () => this.loadChapitres(this.detailsCourse!.id!),
      error: (err) => console.error(err)
    });
  }
}
