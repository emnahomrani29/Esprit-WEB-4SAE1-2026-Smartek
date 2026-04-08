import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanningService, PlanningItemDTO, PlanningItemRequest, TypeItem } from '../../../core/services/planning.service';

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './planning.component.html',
  styleUrl: './planning.component.scss'
})
export class PlanningComponent implements OnInit {
  items: PlanningItemDTO[] = [];
  filteredItems: PlanningItemDTO[] = [];
  loading = false;
  filterType: TypeItem | 'ALL' = 'ALL';

  showModal = false;
  isEdit = false;
  selectedId: number | null = null;
  form: FormGroup;

  types: TypeItem[] = ['EVENT', 'COURS', 'EXAMEN'];

  constructor(
    private planningService: PlanningService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      type: ['EVENT', Validators.required],
      lieu: [''],
      responsable: [''],
      dateDebut: ['', Validators.required],
      dateFin: ['']
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.planningService.getAll().subscribe({
      next: (data) => {
        this.items = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  applyFilter(): void {
    this.filteredItems = this.filterType === 'ALL'
      ? this.items
      : this.items.filter(i => i.type === this.filterType);
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  openCreate(): void {
    this.isEdit = false;
    this.selectedId = null;
    this.form.reset({ type: 'EVENT' });
    this.showModal = true;
  }

  openEdit(item: PlanningItemDTO): void {
    this.isEdit = true;
    this.selectedId = item.id;
    this.form.patchValue({
      titre: item.titre,
      description: item.description,
      type: item.type,
      lieu: item.lieu,
      responsable: item.responsable,
      dateDebut: item.dateDebut?.substring(0, 16),
      dateFin: item.dateFin?.substring(0, 16)
    });
    this.showModal = true;
  }

  save(): void {
    if (this.form.invalid) return;
    const data: PlanningItemRequest = this.form.value;

    const req$ = this.isEdit && this.selectedId
      ? this.planningService.update(this.selectedId, data)
      : this.planningService.create(data);

    req$.subscribe({ next: () => { this.load(); this.showModal = false; } });
  }

  delete(id: number): void {
    if (!confirm('Supprimer cet élément du planning ?')) return;
    this.planningService.delete(id).subscribe({ next: () => this.load() });
  }

  getTypeColor(type: TypeItem): string {
    const map: Record<TypeItem, string> = {
      'EVENT': 'bg-blue-100 text-blue-700',
      'COURS': 'bg-green-100 text-green-700',
      'EXAMEN': 'bg-red-100 text-red-700'
    };
    return map[type];
  }

  getTypeIcon(type: TypeItem): string {
    const map: Record<TypeItem, string> = {
      'EVENT': '📅',
      'COURS': '📚',
      'EXAMEN': '📝'
    };
    return map[type];
  }

  // Grouper par mois pour l'affichage calendrier
  getGroupedByMonth(): { month: string; items: PlanningItemDTO[] }[] {
    const groups: Map<string, PlanningItemDTO[]> = new Map();
    this.filteredItems.forEach(item => {
      const d = new Date(item.dateDebut);
      const key = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(item);
    });
    return Array.from(groups.entries()).map(([month, items]) => ({ month, items }));
  }
}
