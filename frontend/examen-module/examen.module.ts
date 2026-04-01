import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ExamenRoutingModule } from './examen-routing.module';
import { ExamenListComponent } from './components/examen-list/examen-list.component';
import { ExamenFormComponent } from './components/examen-form/examen-form.component';
import { ExamenDetailComponent } from './components/examen-detail/examen-detail.component';
import { KeycloakInterceptor } from './interceptors/keycloak.interceptor';

@NgModule({
  declarations: [
    ExamenListComponent,
    ExamenFormComponent,
    ExamenDetailComponent
  ],
  imports: [
    CommonModule,
    ExamenRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakInterceptor,
      multi: true
    }
  ]
})
export class ExamenModule { }
