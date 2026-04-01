import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamenListComponent } from './components/examen-list/examen-list.component';
import { ExamenFormComponent } from './components/examen-form/examen-form.component';
import { ExamenDetailComponent } from './components/examen-detail/examen-detail.component';

const routes: Routes = [
  { path: '', component: ExamenListComponent },
  { path: 'new', component: ExamenFormComponent },
  { path: 'edit/:id', component: ExamenFormComponent },
  { path: ':id', component: ExamenDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamenRoutingModule { }
