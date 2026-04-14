import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseDetailModalComponent } from './components/course-detail-modal/course-detail-modal.component';

@NgModule({
  declarations: [
    CourseDetailModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CourseDetailModalComponent
  ]
})
export class SharedModule { }
