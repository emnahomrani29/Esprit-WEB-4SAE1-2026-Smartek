import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamenService, ExamenDTO, TentativeDTO } from '../../../core/services/examen.service';
import { CertificationService, CertificationDTO } from '../../../core/services/certification.service';
import { AuthService } from '../../../core/services/auth.service';

type View = 'liste' | 'passer' | 'resultat' | 'historique' | 'certifications';

@Component({
  selector: 'app-my-exams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-exams.component.html',
  styleUrl: './my-exams.component.scss'
})
export class MyExamsComponent implements OnInit {
  view: View = 'liste';
  loading = false;
  userId = '';

  // Liste
  examens: ExamenDTO[] = [];
  tentatives: TentativeDTO[] = [];

  // Passer examen
  examenEnCours: ExamenDTO | null = null;
  reponsesSelectionnees: Map<number, number[]> = new Map(); // questionId -> reponseIds
  tempsRestant = 0;
  timer: any;

  // Résultat
  dernierResultat: TentativeDTO | null = null;

  certifications: CertificationDTO[] = [];

  constructor(
    private examenService: ExamenService,
    private certificationService: CertificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUserInfo();
    this.userId = user?.userId?.toString() || '';
    this.loadExamens();
    this.loadTentatives();
  }

  loadExamens(): void {
    this.loading = true;
    this.examenService.getAll().subscribe({
      next: (data) => { this.examens = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  loadTentatives(): void {
    if (!this.userId) return;
    this.examenService.getMesTentatives(this.userId).subscribe({
      next: (data) => this.tentatives = data
    });
  }

  // Vérifier si l'apprenant a déjà passé cet examen
  aDejaPasse(examenId: number): TentativeDTO | undefined {
    return this.tentatives.find(t => t.examenId === examenId);
  }

  // Démarrer l'examen
  commencerExamen(examen: ExamenDTO): void {
    // Charger sans les bonnes réponses
    this.examenService.getById(examen.id, false).subscribe({
      next: (e) => {
        this.examenEnCours = e;
        this.reponsesSelectionnees = new Map();
        this.tempsRestant = e.dureeMinutes * 60;
        this.view = 'passer';
        this.startTimer();
      }
    });
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      this.tempsRestant--;
      if (this.tempsRestant <= 0) {
        clearInterval(this.timer);
        this.soumettre();
      }
    }, 1000);
  }

  get tempsFormate(): string {
    const m = Math.floor(this.tempsRestant / 60);
    const s = this.tempsRestant % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  toggleReponse(questionId: number, reponseId: number): void {
    const current = this.reponsesSelectionnees.get(questionId) || [];
    const idx = current.indexOf(reponseId);
    if (idx >= 0) current.splice(idx, 1);
    else current.push(reponseId);
    this.reponsesSelectionnees.set(questionId, [...current]);
  }

  isSelected(questionId: number, reponseId: number): boolean {
    return (this.reponsesSelectionnees.get(questionId) || []).includes(reponseId);
  }

  soumettre(): void {
    if (!this.examenEnCours || !this.userId) return;
    clearInterval(this.timer);

    const toutesReponses: number[] = [];
    this.reponsesSelectionnees.forEach(ids => toutesReponses.push(...ids));

    this.examenService.passer(this.examenEnCours.id, this.userId, toutesReponses).subscribe({
      next: (resultat) => {
        this.dernierResultat = resultat;
        this.loadTentatives();
        this.view = 'resultat';
      }
    });
  }

  voirHistorique(): void { this.view = 'historique'; }

  voirCertifications(): void {
    this.view = 'certifications';
    this.certificationService.getMesCertifications(this.userId).subscribe({
      next: (data) => this.certifications = data
    });
  }

  downloadCertificat(id: number): void {
    this.certificationService.downloadPdf(id);
  }

  retourListe(): void {
    this.view = 'liste';
    this.examenEnCours = null;
    this.dernierResultat = null;
    clearInterval(this.timer);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
