import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, CourseCreateRequest, CourseUpdateRequest } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8085/api/cours';

  constructor(private http: HttpClient) {}

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getActiveCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/actifs`);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  getCoursesByCategorie(categorie: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/categorie/${categorie}`);
  }

  createCourse(course: CourseCreateRequest): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  updateCourse(id: number, course: CourseUpdateRequest): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getChapitres(courId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${courId}/chapitres`);
  }

  createChapitre(courId: number, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${courId}/chapitres`, data);
  }

  deleteChapitre(courId: number, chapitreId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${courId}/chapitres/${chapitreId}`);
  }
}
