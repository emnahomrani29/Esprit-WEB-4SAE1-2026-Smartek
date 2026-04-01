import { Component, OnInit } from '@angular/core';
import { ExamenService } from '../../services/examen.service';
import { Examen } from '../../models/examen.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-examen-list',
  templateUrl: './examen-list.component.html',
  styleUrls: ['./examen-list.component.css']
})
export class ExamenListComponent implements OnInit {
  examens: Examen[] = [];
  filteredExamens: Examen[] = [];
  searchTerm: string = '';

  constructor(private examenService: ExamenService, private router: Router) {}

  ngOnInit(): void {
    this.loadExamens();
  }

  loadExamens() {
    this.examenService.getAllExamens().subscribe({
      next: (data) => {
        this.examens = data;
        this.filteredExamens = data;
      },
      error: (err) => console.error('Erreur lors du chargement des examens', err)
    });
  }

  filterByMatiere() {
    if (!this.searchTerm) {
      this.filteredExamens = this.examens;
    } else {
      this.filteredExamens = this.examens.filter(e => 
        e.matiere.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  deleteExamen(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cet examen ?')) {
      this.examenService.deleteExamen(id).subscribe({
        next: () => {
          this.examens = this.examens.filter(e => e.id !== id);
          this.filterByMatiere();
        },
        error: (err) => alert('Erreur lors de la suppression')
      });
    }
  }

  editExamen(id: number) {
    this.router.navigate(['/examens/edit', id]);
  }

  viewDetails(id: number) {
    this.router.navigate(['/examens', id]);
  }
}
