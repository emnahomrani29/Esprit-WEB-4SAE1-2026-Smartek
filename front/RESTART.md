# Guide de Redémarrage - IMPORTANT

## Le problème : Les boutons ne fonctionnent pas

Cela arrive souvent quand Angular n'a pas recompilé correctement les changements.

## Solution : Redémarrer le serveur Angular

### Étape 1 : Arrêter le serveur

Dans le terminal où `ng serve` est lancé :
1. Appuyez sur **Ctrl+C**
2. Confirmez l'arrêt

### Étape 2 : Nettoyer le cache

```bash
cd front
rmdir /s /q .angular
rmdir /s /q node_modules\.cache
```

Ou sur PowerShell :
```powershell
cd front
Remove-Item -Recurse -Force .angular -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
```

### Étape 3 : Redémarrer

```bash
ng serve
```

### Étape 4 : Attendre la compilation

Attendez de voir :
```
✔ Browser application bundle generation complete.
✔ Compiled successfully.
```

### Étape 5 : Rafraîchir le navigateur

1. Ouvrez http://localhost:4200
2. Appuyez sur **Ctrl+F5** (rafraîchissement forcé)
3. Ouvrez la console (F12)

### Étape 6 : Tester

1. Cliquez sur un bouton "Voir"
2. Vérifiez dans la console si vous voyez :
   ```
   === viewCourse CALLED ===
   Opening modal for course ID: X
   ```

## Si ça ne fonctionne toujours pas

### Vérification 1 : Erreurs de compilation

Dans le terminal `ng serve`, cherchez des lignes rouges avec "ERROR".

### Vérification 2 : Erreurs dans la console du navigateur

Ouvrez F12 → Console, cherchez des erreurs rouges.

### Vérification 3 : Recompilation complète

```bash
cd front
ng build
```

Si des erreurs apparaissent, copiez-les et partagez-les.

## Commandes de Diagnostic

Exécutez ces commandes et partagez le résultat :

```bash
cd front
ng version
```

```bash
cd front
ng build --configuration development 2>&1
```

## Alternative : Utiliser un serveur de développement propre

```bash
cd front
ng serve --port 4201 --open
```

Cela ouvrira l'application sur un nouveau port (4201).
