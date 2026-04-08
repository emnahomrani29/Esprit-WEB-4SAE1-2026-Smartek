import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, catchError, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

export interface RegisterRequest {
  firstName: string;
  email: string;
  password: string;
  phone?: string;
  imageBase64?: string;
  experience?: number;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  firstName: string;
  role: string;
  imageBase64?: string;
  experience?: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth'; // auth-service-node
  private keycloakUrl = 'http://localhost:8180/realms/smartek-realm2/protocol/openid-connect';
  private clientId = 'postman-client';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => {
        this.saveToken(response.token);
        this.saveUserInfo(response);
      })
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<any>(`${this.apiUrl}/login`, request).pipe(
      map(response => {
        // auth-service-node retourne directement { token, userId, email, firstName, role }
        const authResponse: AuthResponse = {
          token: response.token,
          userId: response.userId,
          email: response.email,
          firstName: response.firstName,
          role: response.role,
          imageBase64: response.imageBase64,
          experience: response.experience ?? 0,
          message: response.message || 'Login successful'
        };

        this.saveToken(authResponse.token);
        this.saveUserInfo(authResponse);

        return authResponse;
      }),
      catchError(error => throwError(() => error))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  private saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private saveUserInfo(userInfo: AuthResponse): void {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserInfo(): AuthResponse | null {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) return null;
    
    try {
      const parsed = JSON.parse(userInfo);
      // S'assurer que experience existe, sinon mettre 0 par défaut
      if (parsed && typeof parsed.experience === 'undefined') {
        parsed.experience = 0;
      }
      return parsed;
    } catch (e) {
      console.error('Error parsing user info:', e);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  validateUser(): Observable<boolean> {
    const userInfo = this.getUserInfo();
    if (!userInfo || !userInfo.token) {
      return of(false);
    }

    // For Keycloak users, just check if token exists and is valid
    // No need to call backend validation
    return of(true);
  }

  fetchUserData(): Observable<AuthResponse> {
    const userInfo = this.getUserInfo();
    if (!userInfo) {
      return of({} as AuthResponse);
    }

    // For Keycloak users, return cached user info
    // No need to fetch from backend
    return of(userInfo);
  }

  // OAuth2 Methods
  loginWithGoogle(): void {
    const clientId = '708781915546-i6vd4l88tdipk7072ehigjtrg12belms.apps.googleusercontent.com';
    const redirectUri = 'http://localhost:8081/api/auth/oauth2/callback/google';
    const scope = 'email profile';
    const responseType = 'code';


    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=${responseType}&` +
      `scope=${encodeURIComponent(scope)}`;

    window.location.href = authUrl;
  }

  loginWithGithub(): void {
    const clientId = '708781915546-baash0a8qekja8qro6ionv1gp8qf805c.apps.googleusercontent.com'; // À remplacer par votre client ID
    const redirectUri = 'http://localhost:8081/api/auth/oauth2/callback/github';
    const scope = 'user:email read:user';
    
    const authUrl = `https://github.com/login/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}`;
    
    window.location.href = authUrl;
  }
}
