# SMARTEK Microservices Platform

Architecture microservices avec Eureka Server, API Gateway, Course Service et Frontend Angular.

## Structure du Projet

```
├── eureka/             # Service de découverte Eureka (port 8761)
├── ApiGateway/         # Passerelle API (port 9090)
├── course-service/     # Service de gestion des cours (port 8082)
└── front/              # Application Angular 18 (port 4200)
```

## Prérequis

### Backend
- Java 17
- Maven 3.6+
- MySQL 8.0+

### Frontend
- Node.js 18+
- Angular CLI 18
- npm

## Configuration de la Base de Données

Créez la base de données MySQL :

```sql
CREATE DATABASE smartek_db;
```

Configurez les credentials dans `course-service/src/main/resources/application.yml`

## Ordre de Démarrage

### Backend

Les services doivent être démarrés dans cet ordre :

#### 1. Eureka Server (Service de Découverte)

```bash
cd eureka
mvn clean install
mvn spring-boot:run
```

Accès : http://localhost:8761

#### 2. API Gateway

```bash
cd ApiGateway
mvn clean install
mvn spring-boot:run
```

Accès : http://localhost:9090

#### 3. Course Service

```bash
cd course-service
mvn clean install
mvn spring-boot:run
```

Accès : http://localhost:8082

### Frontend

#### 4. Application Angular

```bash
cd front
npm install
npm start
```

Accès : http://localhost:4200

## Architecture Frontend

Le frontend Angular 18 suit une **architecture modulaire** avec :

- **Core Module** : Services singleton et modèles partagés
- **Features Modules** : Modules de fonctionnalités avec lazy loading
- **Routing** : Navigation avec chargement à la demande

Voir [front/ARCHITECTURE.md](front/ARCHITECTURE.md) pour plus de détails.

## Endpoints via API Gateway

Une fois tous les services démarrés, accédez aux services via la gateway :

### Courses
- **GET** http://localhost:9090/api/courses - Liste tous les cours
- **POST** http://localhost:9090/api/courses - Créer un cours
- **GET** http://localhost:9090/api/courses/{id} - Récupérer un cours
- **PUT** http://localhost:9090/api/courses/{id} - Mettre à jour un cours
- **DELETE** http://localhost:9090/api/courses/{id} - Supprimer un cours
- **GET** http://localhost:9090/api/courses/trainer/{trainerId} - Cours par formateur

### Chapters
- **GET** http://localhost:9090/api/courses/{courseId}/chapters - Liste des chapitres
- **POST** http://localhost:9090/api/courses/{courseId}/chapters - Créer un chapitre
- **GET** http://localhost:9090/api/courses/{courseId}/chapters/{chapterId} - Récupérer un chapitre
- **PUT** http://localhost:9090/api/courses/{courseId}/chapters/{chapterId} - Mettre à jour un chapitre
- **DELETE** http://localhost:9090/api/courses/{courseId}/chapters/{chapterId} - Supprimer un chapitre
- **POST** http://localhost:9090/api/courses/{courseId}/chapters/{chapterId}/upload-pdf - Upload PDF
- **GET** http://localhost:9090/api/courses/{courseId}/chapters/{chapterId}/pdf - Télécharger PDF

## Accès Direct aux Services

Vous pouvez aussi accéder directement aux services (sans passer par la gateway) :

- **Frontend** : http://localhost:4200
- **Course Service** : http://localhost:8082/courses/**
- **Eureka Dashboard** : http://localhost:8761
- **Gateway Routes** : http://localhost:9090/actuator/gateway/routes

## Vérification

1. Dashboard Eureka : http://localhost:8761
2. Vérifiez que `course-service` et `api-gateway` sont enregistrés dans Eureka
3. Testez les routes : http://localhost:9090/actuator/gateway/routes
4. Accédez à l'interface : http://localhost:4200

## Architecture Globale

```
                    ┌─────────────────┐
                    │  Angular App    │
                    │  (Port 4200)    │
                    └────────┬────────┘
                             │
                             ↓
                    ┌─────────────────┐
                    │  API Gateway    │
                    │  (Port 9090)    │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                ↓                         ↓
       ┌─────────────────┐      ┌─────────────────┐
       │ Course Service  │      │  Eureka Server  │
       │  (Port 8082)    │←────→│  (Port 8761)    │
       └─────────┬───────┘      └─────────────────┘
                 ↓
       ┌─────────────────┐
       │  MySQL Database │
       │  (smartek_db)   │
       └─────────────────┘
```

## Configuration

### Eureka Server
- Port: 8761
- Pas d'enregistrement auprès d'autres instances Eureka

### API Gateway
- Port: 9090
- Route: `/api/courses/**` → `course-service`
- Load balancing automatique via Eureka
- CORS activé pour le frontend

### Course Service
- Port: 8082
- Base de données: MySQL (smartek_db)
- Enregistré auprès d'Eureka sous le nom: `course-service`

### Frontend Angular
- Port: 4200
- Architecture modulaire avec lazy loading
- Communication avec API Gateway
- Gestion des cours et chapitres

## Technologies Utilisées

### Backend
- Spring Boot 3.2.0
- Spring Cloud 2023.0.0
- Netflix Eureka
- Spring Cloud Gateway
- MySQL 8.0
- Lombok
- JPA/Hibernate

### Frontend
- Angular 18
- TypeScript
- RxJS
- Reactive Forms
- HttpClient
