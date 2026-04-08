import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HeroComponent } from '../hero/hero.component';
import { CompaniesComponent } from '../companies/companies.component';
import { CoursesComponent } from '../courses/courses.component';
import { MentorsComponent } from '../mentors/mentors.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { ContactComponent } from '../contact/contact.component';
import { NewsletterComponent } from '../newsletter/newsletter.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeroComponent,
    CompaniesComponent,
    CoursesComponent,
    MentorsComponent,
    TestimonialsComponent,
    ContactComponent,
    NewsletterComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirect authenticated users to dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard/events']);
    }
  }
}
