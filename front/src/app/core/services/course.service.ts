import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, CourseResponse, Chapter, ChapterResponse } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:9090/api/courses';

  constructor(private http: HttpClient) { }

  // Course endpoints
  getAllCourses(): Observable<CourseResponse[]> {
    return this.http.get<CourseResponse[]>(this.apiUrl);
  }

  getCourseById(id: number): Observable<CourseResponse> {
    return this.http.get<CourseResponse>(`${this.apiUrl}/${id}`);
  }

  getCoursesByTrainer(trainerId: number): Observable<CourseResponse[]> {
    return this.http.get<CourseResponse[]>(`${this.apiUrl}/trainer/${trainerId}`);
  }

  createCourse(course: Course): Observable<CourseResponse> {
    return this.http.post<CourseResponse>(this.apiUrl, course);
  }

  updateCourse(id: number, course: Course): Observable<CourseResponse> {
    return this.http.put<CourseResponse>(`${this.apiUrl}/${id}`, course);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Chapter endpoints
  getChaptersByCourse(courseId: number): Observable<ChapterResponse[]> {
    return this.http.get<ChapterResponse[]>(`${this.apiUrl}/${courseId}/chapters`);
  }

  getChapterById(courseId: number, chapterId: number): Observable<ChapterResponse> {
    return this.http.get<ChapterResponse>(`${this.apiUrl}/${courseId}/chapters/${chapterId}`);
  }

  createChapter(courseId: number, chapter: Chapter): Observable<ChapterResponse> {
    return this.http.post<ChapterResponse>(`${this.apiUrl}/${courseId}/chapters`, chapter);
  }

  updateChapter(courseId: number, chapterId: number, chapter: Chapter): Observable<ChapterResponse> {
    return this.http.put<ChapterResponse>(`${this.apiUrl}/${courseId}/chapters/${chapterId}`, chapter);
  }

  deleteChapter(courseId: number, chapterId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${courseId}/chapters/${chapterId}`);
  }

  uploadChapterPdf(courseId: number, chapterId: number, file: File): Observable<ChapterResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ChapterResponse>(`${this.apiUrl}/${courseId}/chapters/${chapterId}/upload-pdf`, formData);
  }

  getChapterPdf(courseId: number, chapterId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${courseId}/chapters/${chapterId}/pdf`, {
      responseType: 'blob'
    });
  }
}
