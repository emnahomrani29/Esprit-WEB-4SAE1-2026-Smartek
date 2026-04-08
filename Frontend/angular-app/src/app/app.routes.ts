import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page/home-page.component';
import { DashboardLayoutComponent } from './features/dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
import { JobOffersRouterComponent } from './features/dashboard/job-offers-router/job-offers-router.component';
import { JobOffersComponent } from './features/dashboard/job-offers/job-offers.component';
import { JobOffersLearnerComponent } from './features/learner/job-offers/job-offers-learner.component';
import { InterviewsLearnerComponent } from './features/learner/interviews/interviews-learner.component';
import { TestNotificationsComponent } from './features/learner/test-notifications/test-notifications.component';
import { SignUpComponent } from './features/auth/sign-up/sign-up.component';
import { SignInComponent } from './features/auth/sign-in/sign-in.component';
import { Oauth2SuccessComponent } from './features/auth/oauth2-success/oauth2-success.component';
import { SettingsComponent } from './features/settings/settings.component';
import { authGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';
import { Permission } from './core/enums/permission.enum';
import { Role } from './core/enums/role.enum';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'auth/sign-in', component: SignInComponent },
  { path: 'auth/sign-up', component: SignUpComponent },
  { path: 'auth/oauth2/success', component: Oauth2SuccessComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: 'test-offers', component: JobOffersComponent }, // Route de test sans guards
  { path: 'test-offers-learner', component: JobOffersLearnerComponent }, // Route de test pour learner
  { path: 'test-interviews-learner', component: InterviewsLearnerComponent }, // Route de test pour entretiens learner
  { path: 'test-notifications', component: TestNotificationsComponent }, // Route de test pour notifications
  { 
    path: 'dashboard', 
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { 
        path: '', 
        redirectTo: 'events',
        pathMatch: 'full'
      },
      { 
        path: 'profile', 
        loadComponent: () => import('./features/dashboard/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [permissionGuard],
        data: { permissions: [Permission.PROFILE_VIEW] }
      },
      // Course Management - RH_SMARTEK & TRAINER
      { 
        path: 'courses',
        loadComponent: () => import('./features/dashboard/course-management/course-management.component').then(m => m.CourseManagementComponent),
        canActivate: [permissionGuard],
        data: { roles: [Role.RH_SMARTEK, Role.TRAINER] }
      },
      // Chapter Management - RH_SMARTEK & TRAINER
      { 
        path: 'courses/:courseId/chapters',
        loadComponent: () => import('./features/dashboard/chapter-management/chapter-management.component').then(m => m.ChapterManagementComponent),
        canActivate: [permissionGuard],
        data: { roles: [Role.RH_SMARTEK, Role.TRAINER] }
      },
      // My Courses - LEARNER
      { 
        path: 'my-courses', 
        loadComponent: () => import('./features/dashboard/my-courses/my-courses.component').then(m => m.MyCoursesComponent),
        canActivate: [authGuard]
      },
      // Exam Management - RH_SMARTEK & TRAINER
      { 
        path: 'exams', 
        loadComponent: () => import('./features/dashboard/exam-management/exam-management.component').then(m => m.ExamManagementComponent),
        canActivate: [authGuard]
      },
      // My Exams - LEARNER
      { 
        path: 'my-exams', 
        loadComponent: () => import('./features/dashboard/my-exams/my-exams.component').then(m => m.MyExamsComponent),
        canActivate: [authGuard]
      },
      // Training Management - All with TRAINING_VIEW permission
      { 
        path: 'training', 
        loadComponent: () => import('./features/dashboard/training-management/training-management.component').then(m => m.TrainingManagementComponent),
        canActivate: [permissionGuard],
        data: { permissions: [Permission.TRAINING_VIEW] }
      },
      // My Training - LEARNER
      { 
        path: 'my-training',
        loadComponent: () => import('./features/dashboard/my-training/my-training.component').then(m => m.MyTrainingComponent),
        canActivate: [authGuard]
      },
      // Certifications & Badges
      { 
        path: 'certifications', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.CERTIFICATIONS_VIEW, Permission.BADGES_VIEW] }
      },
      // My Certifications - LEARNER
      { 
        path: 'my-certifications', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { roles: [Role.LEARNER], permissions: [Permission.CERTIFICATIONS_VIEW] }
      },
      // Skill Evidence
      { 
        path: 'skill-evidence', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.SKILL_EVIDENCE_VIEW, Permission.SKILL_EVIDENCE_VIEW_ALL] }
      },
      // Interview Management
      { 
        path: 'interviews', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.INTERVIEWS_VIEW, Permission.INTERVIEWS_CREATE] }
      },
      // Job Offers - Route intelligente selon le rôle
      { 
        path: 'job-offers', 
        component: JobOffersRouterComponent
      },
      // Planning
      { 
        path: 'planning', 
        loadComponent: () => import('./features/dashboard/planning/planning.component').then(m => m.PlanningComponent),
        canActivate: [authGuard]
      },
      // Event Management - All authenticated users can view
      { 
        path: 'events', 
        loadComponent: () => import('./features/dashboard/events/events.component').then(m => m.EventsComponent),
        canActivate: [authGuard]
      },
      // Create Event - ADMIN & TRAINER only
      { 
        path: 'events/create', 
        loadComponent: () => import('./features/dashboard/events/event-form/event-form.component').then(m => m.EventFormComponent),
        canActivate: [authGuard]
      },
      // View Event Details - All authenticated users
      { 
        path: 'events/:id', 
        loadComponent: () => import('./features/dashboard/events/event-detail/event-detail.component').then(m => m.EventDetailComponent),
        canActivate: [authGuard]
      },
      // Edit Event - ADMIN & TRAINER only
      { 
        path: 'events/:id/edit', 
        loadComponent: () => import('./features/dashboard/events/event-form/event-form.component').then(m => m.EventFormComponent),
        canActivate: [authGuard]
      },
      // User Management
      { 
        path: 'users', 
        loadComponent: () => import('./features/dashboard/users/users.component').then(m => m.UsersComponent),
        canActivate: [authGuard]
      },
      // Company Management
      { 
        path: 'companies', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.COMPANIES_VIEW, Permission.COMPANIES_CREATE] }
      },
      // Sponsor Management
      { 
        path: 'sponsors', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.SPONSORS_VIEW] }
      },
      // Contact Management
      { 
        path: 'contacts', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.CONTACTS_VIEW] }
      },
      // Participation
      { 
        path: 'participation', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.PARTICIPATION_VIEW, Permission.PARTICIPATION_VIEW_ALL] }
      },
      // Learning Paths
      { 
        path: 'learning-paths', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.LEARNING_PATH_VIEW] }
      },
      // System Settings - ADMIN
      { 
        path: 'settings', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.SYSTEM_SETTINGS] }
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
