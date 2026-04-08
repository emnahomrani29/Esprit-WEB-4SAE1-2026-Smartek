import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Auth guard checking...', {
    isAuthenticated: authService.isAuthenticated(),
    token: localStorage.getItem('token'),
    userInfo: authService.getUserInfo()
  });

  if (!authService.isAuthenticated()) {

    router.navigate(['/auth/sign-in']);
    return false;
  }

  // For Keycloak users, just check if token exists

  return true;
};
