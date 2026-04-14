# Architecture Modulaire - Frontend Angular 18

## Structure du Projet

```
front/
├── src/
│   ├── app/
│   │   ├── core/                    # Module Core (singleton services, models)
│   │   │   ├── models/              # Modèles de données
│   │   │   │   └── course.model.ts
│   │   │   ├── services/            # Services partagés
│   │   │   │   └── course.service.ts
│   │   │   └── core.module.ts
│   │   │
│   │   ├── features/                # Modules de fonctionnalités
│   │   │   └── courses/             # Module Courses
│   │   │       ├── components/
│   │   │       │   ├── course-list/
│   │   │       │   ├── course-detail/
│   │   │       │   └── course-form/
│   │   │       └── courses.module.ts
│   │   │
│   │   ├── app.component.ts         # Composant racine
│   │   ├── app.config.ts            # Configuration de l'application
│   │   └── app.routes.ts            # Routes principales
│   │
│   ├── index.html
│   ├── main.ts
│   └── styles.css
│
├── angular.json
├── package.json
└── tsconfig.json
```

## Principes d'Architecture

### 1. Core Module
- **Rôle**: Contient les services singleton et les modèles partagés
- **Importation**: Une seule fois dans l'application
- **Contenu**:
  - Services HTTP (CourseService)
  - Modèles de données (Course, Chapter)
  - Guards, Interceptors (à ajouter si nécessaire)

### 2. Features Modules
- **Rôle**: Modules de fonctionnalités isolés et lazy-loadés
- **Avantages**:
  - Chargement à la demande (lazy loading)
  - Isolation des fonctionnalités
  - Meilleure maintenabilité
- **Exemple**: CoursesModule

### 3. Lazy Loading
Les modules de fonctionnalités sont chargés à la demande via le routing:

```typescript
{
  path: 'courses',
  loadChildren: () => import('./features/courses/courses.module')
    .then(m => m.CoursesModule)
}
```

## Modules Créés

### CoursesModule
Module complet pour la gestion des cours avec:
- **CourseListComponent**: Liste des cours
- **CourseDetailComponent**: Détails d'un cours
- **CourseFormComponent**: Création/Modification de cours

## Services

### CourseService
Service centralisé pour toutes les opérations CRUD:
- Gestion des cours (CRUD)
- Gestion des chapitres (CRUD)
- Upload de fichiers PDF
- Communication avec l'API Gateway (http://localhost:9090)

## Routing

### Routes Principales
- `/` → Redirection vers `/courses`
- `/courses` → Liste des cours
- `/courses/new` → Nouveau cours
- `/courses/:id` → Détails du cours
- `/courses/:id/edit` → Modification du cours

## Communication avec le Backend

### API Gateway
- **URL**: http://localhost:9090/api/courses
- **Protocole**: HTTP/REST
- **Format**: JSON

### Endpoints Utilisés
- `GET /api/courses` - Liste des cours
- `POST /api/courses` - Créer un cours
- `GET /api/courses/:id` - Détails d'un cours
- `PUT /api/courses/:id` - Modifier un cours
- `DELETE /api/courses/:id` - Supprimer un cours
- `GET /api/courses/:courseId/chapters` - Chapitres d'un cours

## Bonnes Pratiques Appliquées

1. **Séparation des préoccupations**: Core, Features, Shared
2. **Lazy Loading**: Chargement à la demande des modules
3. **Services Singleton**: Services dans le Core Module
4. **Reactive Forms**: Validation des formulaires
5. **TypeScript Strict**: Types forts pour tous les modèles
6. **Observable Pattern**: RxJS pour la gestion asynchrone
7. **Error Handling**: Gestion centralisée des erreurs

## Évolutions Possibles

- Ajouter un module Shared pour les composants réutilisables
- Implémenter des Guards pour la sécurité
- Ajouter des Interceptors HTTP pour les tokens
- Créer un module Auth pour l'authentification
- Ajouter des tests unitaires et e2e
