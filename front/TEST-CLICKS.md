# Test des Clics - Guide de Débogage

## Étape 1 : Ouvrir la Console du Navigateur

1. Appuyez sur **F12** dans votre navigateur
2. Allez dans l'onglet **Console**
3. Rafraîchissez la page (F5)

## Étape 2 : Vérifier les Logs

Vous devriez voir dans la console :
```
CourseListComponent constructor called
CourseListComponent ngOnInit called
Loading courses...
Courses loaded: [...]
```

## Étape 3 : Tester les Boutons

### Test du bouton "Nouveau Cours"
1. Cliquez sur le bouton "+ Nouveau Cours" en haut
2. Dans la console, vous devriez voir :
   ```
   createCourse called
   Navigation success: true
   ```
3. L'URL devrait changer vers `/courses/new`

### Test du bouton "Voir"
1. Cliquez sur le bouton "Voir" d'une carte de cours
2. Dans la console, vous devriez voir :
   ```
   viewCourse called with id: X
   Navigation success: true
   ```
3. L'URL devrait changer vers `/courses/X`

### Test du bouton "Modifier"
1. Cliquez sur le bouton "Modifier" d'une carte de cours
2. Dans la console, vous devriez voir :
   ```
   editCourse called with id: X
   Navigation success: true
   ```
3. L'URL devrait changer vers `/courses/X/edit`

### Test du bouton "Supprimer"
1. Cliquez sur le bouton "Supprimer" d'une carte de cours
2. Une boîte de dialogue de confirmation devrait apparaître
3. Dans la console, vous devriez voir :
   ```
   deleteCourse called with id: X
   ```
4. Si vous confirmez :
   ```
   Delete confirmed for id: X
   Course deleted successfully
   Loading courses...
   ```

## Étape 4 : Si Aucun Log n'Apparaît

### Problème : Les clics ne sont pas détectés

**Vérification 1 : Inspecter l'élément**
1. Clic droit sur un bouton → "Inspecter"
2. Vérifiez que le bouton a bien l'attribut `(click)`
3. Vérifiez qu'il n'y a pas d'élément qui se superpose

**Vérification 2 : Tester avec onclick**
Dans la console du navigateur, tapez :
```javascript
document.querySelector('.btn-view').onclick = function() {
  console.log('Button clicked!');
}
```
Puis cliquez sur le bouton "Voir". Si "Button clicked!" apparaît, le problème vient d'Angular.

**Vérification 3 : Vérifier le CSS**
Dans la console, tapez :
```javascript
let btn = document.querySelector('.btn-view');
console.log(window.getComputedStyle(btn).pointerEvents);
console.log(window.getComputedStyle(btn).zIndex);
```
Devrait afficher : `auto` et un nombre

## Étape 5 : Solutions

### Solution 1 : Redémarrer le Serveur Angular

```bash
# Dans le terminal où ng serve est lancé
Ctrl+C
ng serve
```

### Solution 2 : Vérifier que le Module est Chargé

Dans la console du navigateur :
```javascript
// Vérifier les composants Angular
let elements = document.querySelectorAll('[ng-version]');
console.log('Angular elements:', elements.length);
```

Si le résultat est 0, Angular n'est pas chargé correctement.

### Solution 3 : Nettoyer et Recompiler

```bash
cd front
rm -rf .angular
ng serve
```

### Solution 4 : Vérifier les Erreurs de Compilation

Dans le terminal où `ng serve` est lancé, cherchez des erreurs rouges.

## Étape 6 : Test Manuel de Navigation

Dans la console du navigateur, testez manuellement la navigation :

```javascript
// Obtenir le router Angular (méthode avancée)
let appRoot = document.querySelector('app-root');
let component = ng.getComponent(appRoot);
console.log(component);
```

## Étape 7 : Vérifier les Données

Dans la console :
```javascript
// Vérifier que les cours sont chargés
let cards = document.querySelectorAll('.course-card');
console.log('Number of course cards:', cards.length);

// Vérifier les IDs
cards.forEach(card => {
  let btn = card.querySelector('.btn-view');
  console.log('Button data-id:', btn.getAttribute('data-id'));
});
```

## Étape 8 : Test avec un Bouton Simple

Si rien ne fonctionne, testez avec un bouton simple.

Modifiez temporairement le HTML pour ajouter :
```html
<button (click)="testClick()">TEST CLICK</button>
```

Et dans le TypeScript :
```typescript
testClick(): void {
  console.log('TEST CLICK WORKS!');
  alert('Click détecté!');
}
```

Si ce bouton fonctionne, le problème vient des autres boutons.

## Informations à Fournir

Si le problème persiste, fournissez :
1. Les logs de la console (copier-coller)
2. Les erreurs dans le terminal `ng serve`
3. La version d'Angular : `ng version`
4. Le navigateur utilisé
5. Capture d'écran de l'onglet Network (F12 → Network)

## Commande de Diagnostic Complète

Exécutez dans le terminal :
```bash
cd front
ng version
npm list @angular/core
ng build --configuration development
```

Copiez le résultat complet.
