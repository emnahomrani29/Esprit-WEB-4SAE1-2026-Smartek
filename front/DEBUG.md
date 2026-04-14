# Guide de Débogage - Frontend Angular

## Problème : Les boutons ne fonctionnent pas

### Vérifications à faire

#### 1. Vérifier la Console du Navigateur (F12)

Ouvrez la console et cherchez les erreurs :
- Erreurs de routing
- Erreurs de module
- Erreurs de compilation

#### 2. Vérifier que le Module est Chargé

Dans la console du navigateur, tapez :
```javascript
console.log('Module loaded');
```

#### 3. Vérifier les Routes

Ouvrez : http://localhost:4200/courses

Les routes configurées :
- `/courses` → Liste des cours
- `/courses/new` → Nouveau cours
- `/courses/:id` → Détail du cours
- `/courses/:id/edit` → Modifier le cours

#### 4. Tester Manuellement les Routes

Essayez d'accéder directement à :
- http://localhost:4200/courses
- http://localhost:4200/courses/new

#### 5. Vérifier les Erreurs TypeScript

Dans le terminal où `ng serve` est lancé, vérifiez s'il y a des erreurs de compilation.

### Solutions Possibles

#### Solution 1 : Recompiler l'Application

```bash
# Arrêter le serveur (Ctrl+C)
cd front
npm run build
ng serve
```

#### Solution 2 : Nettoyer le Cache

```bash
cd front
rm -rf node_modules/.cache
ng serve
```

#### Solution 3 : Vérifier les Imports

Assurez-vous que `CommonModule` est importé dans le module courses.

#### Solution 4 : Vérifier HttpClient

Assurez-vous que `provideHttpClient()` est dans `app.config.ts`

### Erreurs Communes

#### Erreur : "Cannot match any routes"

**Cause** : Le lazy loading ne fonctionne pas correctement

**Solution** : Vérifier `app.routes.ts`

#### Erreur : "No provider for HttpClient"

**Cause** : HttpClient n'est pas fourni

**Solution** : Ajouter `provideHttpClient()` dans `app.config.ts`

#### Erreur : "Cannot read property 'navigate' of undefined"

**Cause** : Le Router n'est pas injecté correctement

**Solution** : Vérifier l'injection dans le constructeur

### Test des Fonctionnalités

#### Test 1 : Bouton "Nouveau Cours"

1. Cliquez sur le bouton "+ Nouveau Cours"
2. Vous devriez être redirigé vers `/courses/new`
3. Le formulaire devrait s'afficher

#### Test 2 : Bouton "Voir"

1. Cliquez sur "Voir" sur une carte de cours
2. Vous devriez être redirigé vers `/courses/:id`
3. Les détails du cours devraient s'afficher

#### Test 3 : Bouton "Modifier"

1. Cliquez sur "Modifier" sur une carte de cours
2. Vous devriez être redirigé vers `/courses/:id/edit`
3. Le formulaire pré-rempli devrait s'afficher

#### Test 4 : Bouton "Supprimer"

1. Cliquez sur "Supprimer" sur une carte de cours
2. Une confirmation devrait apparaître
3. Après confirmation, le cours devrait être supprimé

### Logs de Débogage

Ajoutez ces logs dans `course-list.component.ts` :

```typescript
viewCourse(id: number): void {
  console.log('viewCourse called with id:', id);
  this.router.navigate(['/courses', id]);
}

editCourse(id: number): void {
  console.log('editCourse called with id:', id);
  this.router.navigate(['/courses', id, 'edit']);
}

deleteCourse(id: number): void {
  console.log('deleteCourse called with id:', id);
  if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
    this.courseService.deleteCourse(id).subscribe({
      next: () => {
        console.log('Course deleted successfully');
        this.loadCourses();
      },
      error: (err) => {
        console.error('Error deleting course:', err);
        this.error = 'Erreur lors de la suppression du cours';
      }
    });
  }
}

createCourse(): void {
  console.log('createCourse called');
  this.router.navigate(['/courses/new']);
}
```

### Vérification de l'État de l'Application

Dans la console du navigateur :

```javascript
// Vérifier si Angular est chargé
console.log(ng);

// Vérifier les routes
console.log(window.location.pathname);
```

### Commandes Utiles

```bash
# Voir les erreurs de compilation
ng build

# Lancer en mode production
ng serve --configuration production

# Nettoyer et réinstaller
rm -rf node_modules
npm install
ng serve
```

### Contact et Support

Si le problème persiste :
1. Vérifiez les logs dans la console du navigateur
2. Vérifiez les logs dans le terminal
3. Vérifiez que tous les services backend sont démarrés
4. Vérifiez la configuration CORS
