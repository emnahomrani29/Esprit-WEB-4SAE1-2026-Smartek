import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Intercepteur pour attacher le token d'accès Keycloak aux requêtes sortantes.
 * Cette version suppose que vous utilisez un service pour gérer Keycloak côté frontend.
 */
@Injectable()
export class KeycloakInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Dans une implémentation réelle avec keycloak-angular ou oidc-client,
    // récupérer le token depuis le service d'authentification:
    // const token = this.keycloakService.getToken();

    const token = localStorage.getItem('access_token'); // Exemple simplifié
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return next.handle(request);
  }
}
