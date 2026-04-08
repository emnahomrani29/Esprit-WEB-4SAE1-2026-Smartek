import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormationService, Formation } from '../../../core/services/formation.service';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-my-training',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-training.component.html',
  styleUrl: './my-training.component.scss'
})
export class MyTrainingComponent implements OnInit {
  formations: Formation[] = [];
  isLoading = false;

  // Modal détail formation
  selectedFormation: Formation | null = null;
  formationCours: Course[] = [];
  loadingCours = false;

  constructor(
    private formationService: FormationService,
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations(): void {
    this.isLoading = true;
    this.formationService.getAll().subscribe({
      next: (data) => { this.formations = data.filter(f => f.actif); this.isLoading = false; },
      error: () => this.isLoading = false
    });
  }

  viewFormation(f: Formation): void {
    this.selectedFormation = f;
    this.formationCours = [];
    if (f.courIds && f.courIds.length > 0) {
      this.loadingCours = true;
      this.courseService.getAllCourses().subscribe({
        next: (all) => {
          this.formationCours = all.filter(c => f.courIds!.includes(c.id!));
          this.loadingCours = false;
        },
        error: () => this.loadingCours = false
      });
    }
  }

  viewCours(courId: number): void {
    this.router.navigate(['/dashboard/my-courses']);
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
