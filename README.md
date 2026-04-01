# Gestion des Examens - Microservice

Bienvenue dans le projet **Gestion des Examens**. Ce document vous explique l'architecture, le fonctionnement et la structure du projet.

## 1. Introduction et architecture
Ce projet est une application web distribuée (Architecture Microservices) conçue pour gérer les examens. Elle est composée de plusieurs briques technologiques :
- **Backend (Spring Boot 3.x)** : Gère la logique métier des examens sur le port `8083`.
- **Frontend (Angular 18)** : Fournit l'interface utilisateur accessible sur le port `4200`.
- **API Gateway & Eureka (Ports 8080 & 8761)** : Utilisés (en production) pour le routage des requêtes et la découverte des microservices.
- **Keycloak (Port 8080)** : Solution de gestion des identités qui fournit les accès sécurisés via l'authentification OAuth2 (JWT Tokens).

## 2. Backend - Spring Boot
Le backend est situé dans le dossier `/backend/`. C'est l'API REST qui connecte votre base de données à votre interface utilisateur.

**Points clés du Backend :**
- **Base de données :** MySQL (`examen_db`) tourne sur le port `3306`.
- **API REST :** Les requêtes (GET, POST, PUT, DELETE, PATCH) sont accessibles via `http://localhost:8083/api/examens`.
- **Entité Examen :** Composée de divers attributs (`titre`, `matiere`, `dateExamen`, `duree`, `salle`, `coefficient`, `typeExamen`, `statut`).
- **Sécurité :** L'accès est contrôlé par *Spring Security* (Keycloak). Par défaut, sans protection activée localement, les requêtes comme la création d'examens nécessitent le paramètre `.permitAll()` pour vos tests, sinon un rôle `ADMIN` sera exigé par Keycloak.

**Comment le lancer :**
Dans le dossier `/backend/`, tapez la commande : `mvn spring-boot:run`

## 3. Frontend - Angular 18
Le frontend est situé dans le dossier `/frontend/examen-front/`. C'est ce que voit l'utilisateur final.

**Points clés du Frontend :**
- L'application est conscrite dans le module `examen-module`.
- **Composants :** 
  - `ExamenListComponent` : Affiche la liste des examens.
  - `ExamenFormComponent` : Formulaire de création/édition d'examens avec validation (Reactive Forms).
  - `ExamenDetailComponent` : Affiche de manière isolée les détails d'un examen donné.
- **Requêtes HTTP :** Le service métier `examen.service.ts` se connecte en local sur `http://localhost:8083/api/examens` et alimente vos composants.

**Comment le lancer :**
Dans le dossier `/frontend/examen-front/`, tapez la commande : `npm start` (ou `ng serve`).
Votre interface sera ensuite accessible sur `http://localhost:4200/examens`.

## 4. Tests et démonstration
Si vous voulez tester la solution localement :
1. Lancez le **backend** (assurez-vous que MySQL est actif via XAMPP ou WAMP).
2. Lancez le **frontend**.
3. Accédez à `http://localhost:4200/examens`. 
4. Les ajouts effectués sur l'interface (création d'un examen) seront envoyés sous format JSON (ex: `{"titre":"Examen Web", "typeExamen":"EXAMEN_FINAL"...}`) et confirmés en base de données de manière asynchrone sans interférer de session !

## 5. Perspectives de déploiement
En conditions réelles d'environnement de production (Cloud) :
1. L'Angular Frontend pointe vers l'**API Gateway** (port 8080 au lieu du port 8083 direct).
2. **Keycloak** est déployé pour récupérer les JWT et autoriser le bouton de soumission à insérer des items.
3. Les instances s'inscrivent de manière dynamique et évolutive sur l'annuaire **Eureka**.

*Merci d'avoir consulté et utilisé ce projet.*
