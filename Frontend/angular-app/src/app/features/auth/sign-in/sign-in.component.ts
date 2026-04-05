import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, AuthResponse } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  signInForm: FormGroup;
  showPassword = false;
  rememberMe = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required]], // Changed from email validator to just required
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.signInForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const loginData = {
        email: this.signInForm.value.email,
        password: this.signInForm.value.password
      };
      
      this.authService.login(loginData).subscribe({
        next: (response: AuthResponse) => {
          this.isLoading = false;
          
          setTimeout(() => {
            this.router.navigate(['/dashboard/events']);
          }, 100);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
        }
      });
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  loginWithGithub() {
    this.authService.loginWithGithub();
  }
}
