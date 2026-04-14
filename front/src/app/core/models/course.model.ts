export interface Course {
  id?: number;
  title: string;
  description: string;
  trainerId: number;
  duration: number;
  level: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Chapter {
  id?: number;
  title: string;
  description: string;
  orderIndex: number;
  courseId: number;
  pdfPath?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseResponse {
  id: number;
  title: string;
  description: string;
  trainerId: number;
  duration: number;
  level: string;
  createdAt: string;
  updatedAt: string;
  message?: string;
}

export interface ChapterResponse {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  courseId: number;
  pdfPath?: string;
  createdAt: string;
  updatedAt: string;
  message?: string;
}
