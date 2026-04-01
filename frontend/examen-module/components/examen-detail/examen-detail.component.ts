import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamenService } from '../../services/examen.service';
import { Examen, StatutExamen } from '../../models/examen.model';

@Component({
  selector: 'app-examen-detail',
  templateUrl: './examen-detail.component.html',
  styleUrls: ['./examen-detail.component.css']
})
export class ExamenDetailComponent implements OnInit {
  examen?: Examen;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examenService: ExamenService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadExamen(id);
    }
  }

  loadExamen(id: number) {
    this.examenService.getExamenById(id).subscribe({
      next: (data) => this.examen = data,
      error: (err) => {
        this.error = "L'examen demandé n'a pas pu être chargé.";
        console.error(err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/examens']);
  }

  changeStatus(newStatut: string) {
    if (this.examen && this.examen.id) {
      this.examenService.changeStatut(this.examen.id, newStatut as StatutExamen).subscribe({
        next: (updatedExamen) => {
          this.examen = updatedExamen;
        },
        error: (err) => alert('Erreur lors de la modification du statut.')
      });
    }
  }
}
