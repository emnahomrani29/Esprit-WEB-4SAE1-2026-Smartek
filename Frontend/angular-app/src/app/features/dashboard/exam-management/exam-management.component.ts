import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ExamenService, ExamenDTO, TentativeDTO } from '../../../core/services/examen.service';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-exam-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './exam-management.component.html',
  styleUrl: './exam-management.component.scss'
})
export class ExamManagementComponent implements OnInit {
  examens: ExamenDTO[] = [];
  cours: Course[] = [];
  loading = false;

  showModal = false;
  examenForm: FormGroup;

  // Résultats
  showResultats = false;
  examenSelectionne: ExamenDTO | null = null;
  tentatives: TentativeDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private examenService: ExamenService,
    private courseService: CourseService
  ) {
    this.examenForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      courId: [null],
      dureeMinutes: [60, [Validators.required, Validators.min(1)]],
      scoreMinimal: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadExamens();
    this.loadCours();
  }

  loadExamens(): void {
    this.loading = true;
    this.examenService.getAll().subscribe({
      next: (data) => { this.examens = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  loadCours(): void {
    this.courseService.getAllCourses().subscribe({
      next: (data) => this.cours = data
    });
  }

  get questions(): FormArray {
    return this.examenForm.get('questions') as FormArray;
  }

  reponses(qi: number): FormArray {
    return this.questions.at(qi).get('reponses') as FormArray;
  }

  addQuestion(): void {
    this.questions.push(this.fb.group({
      enonce: ['', Validators.required],
      points: [1],
      reponses: this.fb.array([
        this.newReponse(), this.newReponse()
      ])
    }));
  }

  removeQuestion(i: number): void {
    this.questions.removeAt(i);
  }

  newReponse(): FormGroup {
    return this.fb.group({ texte: ['', Validators.required], correcte: [false] });
  }

  addReponse(qi: number): void {
    this.reponses(qi).push(this.newReponse());
  }

  removeReponse(qi: number, ri: number): void {
    this.reponses(qi).removeAt(ri);
  }

  openCreateModal(): void {
    this.examenForm.reset({ dureeMinutes: 60, scoreMinimal: 50 });
    while (this.questions.length) this.questions.removeAt(0);
    this.addQuestion();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveExamen(): void {
    if (this.examenForm.invalid) return;
    this.examenService.create(this.examenForm.value).subscribe({
      next: () => { this.loadExamens(); this.closeModal(); }
    });
  }

  deleteExamen(id: number): void {
    if (!confirm('Supprimer cet examen ?')) return;
    this.examenService.delete(id).subscribe({ next: () => this.loadExamens() });
  }

  voirResultats(e: ExamenDTO): void {
    this.examenSelectionne = e;
    this.showResultats = true;
    this.examenService.getTentativesExamen(e.id).subscribe({
      next: (data) => this.tentatives = data
    });
  }

  getCourTitre(courId: number | undefined): string {
    if (!courId) return '-';
    return this.cours.find(c => c.id === courId)?.titre || `Cours #${courId}`;
  }
}
