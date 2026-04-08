import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { FormationService, Formation } from '../../../core/services/formation.service';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';

type Step = 'formations' | 'cours' | 'chapitres';

@Component({
  selector: 'app-training-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './training-management.component.html',
  styleUrl: './training-management.component.scss'
})
export class TrainingManagementComponent implements OnInit {

  currentStep: Step = 'formations';
  loading = false;

  // ── Formations ─────────────────────────────────────────
  formations: Formation[] = [];
  selectedFormation: Formation | null = null;
  showFormationModal = false;
  isEditFormation = false;
  formationForm: FormGroup;

  // ── Cours ──────────────────────────────────────────────
  formationCours: Course[] = [];   // cours liés à la formation sélectionnée
  showCoursModal = false;
  isEditCours = false;
  selectedCours: Course | null = null;
  coursForm: FormGroup;

  // ── Chapitres ──────────────────────────────────────────
  selectedCour: Course | null = null;
  chapitres: any[] = [];
  showChapitreForm = false;
  newChapitre = { titre: '', description: '', ordre: 1 };

  categories = ['Informatique', 'Développement Web', 'Développement Mobile',
    'Intelligence Artificielle', 'Data Science', 'Cybersécurité',
    'Cloud Computing', 'DevOps', 'Design', 'Marketing Digital',
    'Gestion de Projet', 'Langues', 'Autre'];
  niveaux = ['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE'];

  constructor(
    private fb: FormBuilder,
    private formationService: FormationService,
    private courseService: CourseService
  ) {
    this.formationForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      categorie: [''],
      niveau: [''],
      duree: [''],
      actif: [true]
    });

    this.coursForm = this.fb.group({
      titre: ['', Validators.required],
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
    this.loadFormations();
  }

  // ── FORMATIONS ─────────────────────────────────────────
  loadFormations(): void {
    this.loading = true;
    this.formationService.getAll().subscribe({
      next: (data) => { this.formations = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openCreateFormation(): void {
    this.isEditFormation = false;
    this.formationForm.reset({ actif: true });
    this.showFormationModal = true;
  }

  openEditFormation(f: Formation): void {
    this.isEditFormation = true;
    this.selectedFormation = f;
    this.formationForm.patchValue(f);
    this.showFormationModal = true;
  }

  saveFormation(): void {
    if (this.formationForm.invalid) return;
    const req$ = this.isEditFormation && this.selectedFormation?.id
      ? this.formationService.update(this.selectedFormation.id, this.formationForm.value)
      : this.formationService.create(this.formationForm.value);
    req$.subscribe({ next: () => { this.loadFormations(); this.showFormationModal = false; } });
  }

  deleteFormation(id: number): void {
    if (!confirm('Supprimer cette formation ?')) return;
    this.formationService.delete(id).subscribe({ next: () => this.loadFormations() });
  }

  enterFormation(f: Formation): void {
    this.selectedFormation = f;
    this.currentStep = 'cours';
    this.loadFormationCours(f);
  }

  // ── COURS ──────────────────────────────────────────────
  loadFormationCours(f: Formation): void {
    if (!f.courIds || f.courIds.length === 0) {
      this.formationCours = [];
      return;
    }
    // Charger tous les cours puis filtrer par courIds
    this.courseService.getAllCourses().subscribe({
      next: (all) => {
        this.formationCours = all.filter(c => f.courIds!.includes(c.id!));
      }
    });
  }

  openCreateCours(): void {
    this.isEditCours = false;
    this.selectedCours = null;
    this.coursForm.reset({ niveau: 'DEBUTANT', dureeHeures: 1, prix: 0, actif: true });
    this.showCoursModal = true;
  }

  openEditCours(c: Course): void {
    this.isEditCours = true;
    this.selectedCours = c;
    this.coursForm.patchValue(c);
    this.showCoursModal = true;
  }

  saveCours(): void {
    if (this.coursForm.invalid || !this.selectedFormation?.id) return;

    if (this.isEditCours && this.selectedCours?.id) {
      // Modifier le cours dans cour-service
      this.courseService.updateCourse(this.selectedCours.id, this.coursForm.value).subscribe({
        next: () => { this.loadFormationCours(this.selectedFormation!); this.showCoursModal = false; }
      });
    } else {
      // Créer le cours dans cour-service puis l'associer à la formation
      this.courseService.createCourse(this.coursForm.value).subscribe({
        next: (newCour) => {
          this.formationService.addCour(this.selectedFormation!.id!, newCour.id!).subscribe({
            next: (updatedFormation) => {
              this.selectedFormation = updatedFormation;
              this.loadFormationCours(updatedFormation);
              this.showCoursModal = false;
            }
          });
        }
      });
    }
  }

  deleteCours(c: Course): void {
    if (!confirm('Supprimer ce cours de la formation ?') || !this.selectedFormation?.id) return;
    // Retirer de la formation puis supprimer le cours
    this.formationService.removeCour(this.selectedFormation.id, c.id!).subscribe({
      next: (updatedFormation) => {
        this.selectedFormation = updatedFormation;
        this.courseService.deleteCourse(c.id!).subscribe({
          next: () => this.loadFormationCours(updatedFormation)
        });
      }
    });
  }

  enterCours(c: Course): void {
    this.selectedCour = c;
    this.currentStep = 'chapitres';
    this.loadChapitres(c.id!);
  }

  // ── CHAPITRES ──────────────────────────────────────────
  loadChapitres(courId: number): void {
    this.courseService.getChapitres(courId).subscribe({
      next: (data) => { this.chapitres = data; }
    });
  }

  saveChapitre(): void {
    if (!this.newChapitre.titre.trim() || !this.selectedCour?.id) return;
    this.courseService.createChapitre(this.selectedCour.id, this.newChapitre).subscribe({
      next: () => {
        this.loadChapitres(this.selectedCour!.id!);
        this.newChapitre = { titre: '', description: '', ordre: this.chapitres.length + 2 };
        this.showChapitreForm = false;
      }
    });
  }

  deleteChapitre(id: number): void {
    if (!confirm('Supprimer ce chapitre ?') || !this.selectedCour?.id) return;
    this.courseService.deleteChapitre(this.selectedCour.id, id).subscribe({
      next: () => this.loadChapitres(this.selectedCour!.id!)
    });
  }

  // ── Navigation ─────────────────────────────────────────
  goBack(): void {
    if (this.currentStep === 'chapitres') {
      this.currentStep = 'cours';
      this.selectedCour = null;
      this.chapitres = [];
    } else if (this.currentStep === 'cours') {
      this.currentStep = 'formations';
      this.selectedFormation = null;
      this.formationCours = [];
    }
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
