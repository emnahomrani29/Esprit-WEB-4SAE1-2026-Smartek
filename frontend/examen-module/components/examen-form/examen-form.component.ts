import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamenService } from '../../services/examen.service';
import { TypeExamen, StatutExamen, Examen } from '../../models/examen.model';

@Component({
  selector: 'app-examen-form',
  templateUrl: './examen-form.component.html',
  styleUrls: ['./examen-form.component.css']
})
export class ExamenFormComponent implements OnInit {
  examenForm: FormGroup;
  isEditMode = false;
  examenId?: number;
  typesExamen = Object.values(TypeExamen);
  statutsExamen = Object.values(StatutExamen);
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private examenService: ExamenService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.examenForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      matiere: ['', Validators.required],
      dateExamen: ['', Validators.required],
      duree: ['', [Validators.required, Validators.min(15)]],
      salle: ['', Validators.required],
      coefficient: ['', [Validators.required, Validators.min(0)]],
      typeExamen: [TypeExamen.CONTROLE, Validators.required],
      statut: [StatutExamen.PLANIFIE, Validators.required]
    });
  }

  ngOnInit(): void {
    this.examenId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.examenId) {
      this.isEditMode = true;
      this.loadExamen(this.examenId);
    }
  }

  loadExamen(id: number) {
    this.examenService.getExamenById(id).subscribe({
      next: (examen) => {
        // Formater la date pour l'input datetime-local (YYYY-MM-DDTHH:mm)
        const dateStr = examen.dateExamen ? new Date(examen.dateExamen).toISOString().slice(0, 16) : '';
        this.examenForm.patchValue({
          ...examen,
          dateExamen: dateStr
        });
      },
      error: (err) => alert('Erreur lors du chargement des données')
    });
  }

  // Getter pour un accès facile depuis le template HTML
  get f() { return this.examenForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.examenForm.invalid) {
      return;
    }

    const examenData: Examen = this.examenForm.value;

    if (this.isEditMode && this.examenId) {
      this.examenService.updateExamen(this.examenId, examenData).subscribe({
        next: () => this.router.navigate(['/examens']),
        error: (err) => this.handleError(err)
      });
    } else {
      this.examenService.createExamen(examenData).subscribe({
        next: () => this.router.navigate(['/examens']),
        error: (err) => this.handleError(err)
      });
    }
  }

  handleError(err: any) {
    console.error(err);
    alert('Une erreur est survenue lors de l\\'enregistrement.');
  }

  cancel() {
    this.router.navigate(['/examens']);
  }
}
