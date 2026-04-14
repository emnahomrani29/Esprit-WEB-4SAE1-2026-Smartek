# Guide pour Pousser le Code vers GitHub

## Prérequis

Assurez-vous que Git est installé. Pour vérifier :
```bash
git --version
```

Si Git n'est pas installé, téléchargez-le depuis : https://git-scm.com/download/win

## Étapes pour Pousser vers GitHub

### 1. Initialiser le dépôt Git (si ce n'est pas déjà fait)

```bash
git init
```

### 2. Ajouter le dépôt distant

```bash
git remote add origin https://github.com/emnahomrani29/Esprit-WEB-4SAE1-2026-Smartek.git
```

Si le remote existe déjà, vérifiez avec :
```bash
git remote -v
```

### 3. Créer et basculer vers la branche "courses"

```bash
git checkout -b courses
```

### 4. Ajouter tous les fichiers

```bash
git add .
```

### 5. Créer un commit avec un message descriptif

```bash
git commit -m "feat: Add course management microservices with Angular frontend

- Eureka Server for service discovery (port 8761)
- API Gateway with CORS configuration (port 9090)
- Course Service with REST API (port 8082)
- Angular 18 frontend with modular architecture
- Course CRUD operations with modal details view
- Professional UI design with animations
- Lazy loading and routing configuration"
```

### 6. Pousser vers GitHub

```bash
git push -u origin courses
```

Si vous avez des problèmes d'authentification, utilisez un Personal Access Token (PAT) :
```bash
git push https://YOUR_TOKEN@github.com/emnahomrani29/Esprit-WEB-4SAE1-2026-Smartek.git courses
```

## Commandes Alternatives (PowerShell)

Si vous utilisez PowerShell, vous pouvez exécuter :

```powershell
# Vérifier le statut
git status

# Ajouter tous les fichiers
git add .

# Créer un commit
git commit -m "feat: Add course management system"

# Pousser vers GitHub
git push -u origin courses
```

## En cas d'erreur "remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/emnahomrani29/Esprit-WEB-4SAE1-2026-Smartek.git
```

## En cas d'erreur "branch already exists"

```bash
git checkout courses
git add .
git commit -m "feat: Add course management system"
git push origin courses
```

## Vérifier que tout est poussé

```bash
git log --oneline
git branch -a
```

## Créer un fichier .gitignore (si nécessaire)

Créez un fichier `.gitignore` à la racine avec ce contenu :

```
# Node modules
front/node_modules/
front/.angular/
front/dist/

# Maven
**/target/
**/.mvn/
**/mvnw
**/mvnw.cmd

# IDE
**/.idea/
**/.vscode/
*.iml

# Logs
*.log

# OS
.DS_Store
Thumbs.db

# Uploads
course-service/uploads/
```

Puis :
```bash
git add .gitignore
git commit -m "chore: Add .gitignore"
git push origin courses
```

## Structure du Projet Poussé

```
├── eureka/                 # Service Discovery
├── ApiGateway/            # API Gateway
├── course-service/        # Course Microservice
├── front/                 # Angular Frontend
├── README.md             # Documentation principale
└── DEMARRAGE.md          # Guide de démarrage
```

## Après le Push

1. Allez sur GitHub : https://github.com/emnahomrani29/Esprit-WEB-4SAE1-2026-Smartek
2. Vous verrez un message pour créer une Pull Request depuis la branche `courses`
3. Cliquez sur "Compare & pull request"
4. Ajoutez une description et créez la PR

## Commandes Utiles

```bash
# Voir l'historique des commits
git log --oneline --graph

# Voir les fichiers modifiés
git status

# Voir les différences
git diff

# Annuler les modifications non commitées
git checkout -- .

# Voir les branches
git branch -a

# Changer de branche
git checkout main
git checkout courses
```

## Résolution de Conflits

Si vous avez des conflits lors du push :

```bash
# Récupérer les dernières modifications
git pull origin courses

# Résoudre les conflits dans les fichiers
# Puis :
git add .
git commit -m "fix: Resolve merge conflicts"
git push origin courses
```

## Contact et Support

Si vous rencontrez des problèmes :
1. Vérifiez que Git est installé : `git --version`
2. Vérifiez vos credentials GitHub
3. Assurez-vous d'avoir les droits d'écriture sur le dépôt
