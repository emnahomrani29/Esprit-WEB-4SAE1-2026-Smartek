# Event Management System

A microservices-based event management platform built with Spring Boot and Angular.

## Architecture

- **Backend**: Spring Boot microservices
  - Event Service (Port 8084)
  - Eureka Server (Port 8761)
  - API Gateway
  - Config Server
  - Certificate Service
  
- **Frontend**: Angular 18 with Tailwind CSS (Port 4200)

- **Authentication**: Keycloak OAuth2 (Port 8080)
  - Realm: smartek-realm2
  - Client: postman-client

## Features

- Role-based access control (ADMIN, TRAINER, LEARNER)
- Event CRUD operations
- Event registration and participant management
- Real-time event status tracking
- Responsive UI with modern design

## Prerequisites

- Java 17+
- Node.js 18+
- Maven 3.6+
- Docker (for Keycloak)

## Quick Start

### 1. Start Keycloak
```bash
docker start keycloak
```

### 2. Start Backend Services
```bash
# Eureka Server
cd Backend/eureka-server
mvn spring-boot:run

# Event Service
cd Backend/event-service
mvn spring-boot:run
```

### 3. Start Frontend
```bash
cd Frontend/angular-app
npm install
npm start
```

### 4. Access Application
- Frontend: http://localhost:4200
- Keycloak: http://localhost:8080
- Eureka: http://localhost:8761

## Default Users

- **Admin**: admin / admin123
- **Trainer**: formateur / formateur123
- **Learner**: apprenant / apprenant123

## Technology Stack

### Backend
- Spring Boot 3.x
- Spring Cloud (Eureka, Gateway, Config)
- Spring Security OAuth2
- H2 Database
- Maven

### Frontend
- Angular 18
- Tailwind CSS
- RxJS
- TypeScript

## License

Proprietary
