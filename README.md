
# Hazard Arena – TP Jeu HTML5 Canvas

**Auteurs :** Luis-Junior ARAUJO DA COSTA, Tristan TRONCONNI  
**Date :** 13/02/2026  
**Repository GitHub :** <https://github.com/LuisJuniorA/Hazard-Arena>  

## 1. Présentation du projet

Hazard Arena est un jeu vidéo développé en **HTML5 Canvas** avec JavaScript, inspiré des TP et live coding réalisés en cours. Le joueur contrôle un personnage qui se déplace et combat des ennemis dans différents niveaux, avec un système de **vies, XP, upgrades et boss**.  

Le projet respecte globalement les bonnes pratiques suivantes :  

- **Organisation par modules et classes** : chaque entité, HUD, comportement et map possède sa propre classe et fichier.  
- **Utilisation de ctx.save() / ctx.restore()** pour protéger les transformations graphiques.  
- **Animations et déplacements** gérés via `requestAnimationFrame()`.  
- **Système de comportements et upgrades** modulaires pour les entités.  
- **Gestion d’états centralisée** pour le menu, les niveaux et le Game Over.  
- **Système de particules et effets visuels** pour rendre le jeu plus vivant.  

## 2. Fonctionnalités

### Gameplay principal

- Déplacement du joueur avec normalisation des diagonales.  
- Système de **vies et barre de santé animée** (HealthHUD).  
- **Système d’expérience et montée de niveaux** (ExperienceHUD).  
- Collecte d’XP et déclenchement d’un écran d’upgrade (UpgradeFacade).  
- Lancement de **projectiles et sorts** via comportements (PlayerAttack, Fireball).  
- Boss avec arène spécifique (BossArena) et restriction du joueur dans la zone.  

### Ennemis et IA

- Comportements modulaires pour les ennemis : ChasePlayer, AvoidOtherEnemies, ContactDamage, etc.  
- Spawner d’ennemis progressif (EnemySpawner).  
- Boss avec comportement et zone dédiée.  

### HUD et interface

- Barre de vie animée.  
- Barre d’XP animée avec interpolation douce.  
- Affichage des cooldowns des compétences actives.  
- Timer de niveau.  

### Menu et gestion de vues

- Menu d’accueil interactif avec navigation vers les niveaux.  
- Gestion des boutons via canvas et détection de la souris.  
- Musiques et effets sonores centralisés.  

## 3. Organisation du projet

```bash
C:.
│   index.html
├───assets
│   ├───background_map
│   └───sounds
├───css
└───js
├───behaviors
├───common
├───entities
│   ├───base
│   ├───enemies
│   ├───player
│   └───spells
├───facades
├───maps
│   ├───base
│   └───children
├───methods
│   └───hud
├───particles
│   ├───base
│   ├───smoke
│   └───trail
├───upgrades
│   ├───mobility
│   └───offensive
└───utils
```

- Les dossiers `base` contiennent les classes parent abstraites (Entity, Behavior, Particle, Level, etc.).  
- Les dossiers enfants contiennent des implémentations spécifiques (Boss, BigDot, Fireball, maps, HUD…).  
- `methods/hud` regroupe tous les HUD (HealthHUD, ExperienceHUD, AbilityHUD, Timer).  
- `facades` gère les écrans de sélection de compétences (UpgradeFacade).  

## 4. Problèmes rencontrés et limitations

- **Gestion des boutons :** actuellement réalisée via canvas et détection manuelle de la souris. Ce n’est pas idéal, manque de balises HTML natives.  
- **Organisation du code :** deux styles de développement se sont mélangés :  
  - Dev1 : approche SOLID, très modulable et propre.  
  - Dev2 : approche individuelle, moins de modularisation.  
  Résultat : mélange entre usine à gaz et modularisation. Un refactor global est nécessaire.  
- **Arborescence des dossiers :** plusieurs sous-dossiers `base`, `children`, etc. Une structure centralisée “core” serait plus claire.  
- **Animation et logique de l’arène :** certaines variables comme `dead` sont réinitialisées après `EntityManager.cleanup`, ce qui nécessite de gérer la fin d’arène via des flags temporaires.  
- **IA et comportements des ennemis :** simple pour l’instant, possibilité d’ajouter des **steering behaviors** ou des patterns plus complexes.  

## 5. Points dont nous sommes fiers

- Système complet de **particules et effets visuels**.  
- Gestion des **upgrades et compétences** avec écran dédié.  
- Animation fluide des **barres de vie et XP**.  
- Boss avec arène et limitation du joueur dans la zone.  
- Modularité de certaines parties du code, facile à étendre (nouvelles compétences, sorts, ennemis, particules…).
- Mise en place d'effets sonores.  

## 6. Axes d’amélioration

- Refactor complet de l’arborescence et du code pour respecter SOLID de manière uniforme.  
- Ajouter des **comportements avancés pour ennemis** (steering, évitement, regroupement…).  
- Ajouter la **fusion de compétences** ou des upgrades combinés.  
- Améliorer le rendu des monstres et boss pour plus d’attrait visuel.  
- Améliorer la **gestion des boutons** avec des éléments HTML plutôt que canvas.  

## 7. Ressources externes

- [Mooc HTML5 Coding Essentials](https://www.mooc-html5.com) – chapitre sur canvas et transformations géométriques.  
- GitHub du cours : [https://github.com/micbuffa/L3MiageIntroJS2025_2026](https://github.com/micbuffa/L3MiageIntroJS2025_2026)  
- Sons et musiques libres : voir dossier `assets/sounds`.  

## 8. IA utilisée

- **ChatGPT** : aide pour structurer le code, rédiger certains HUD et comportements, et produire ce README.  
- Prompts utilisés :  
  - "Créer un HUD santé animé en canvas HTML5"  
  - "Créer un système de barre d'XP avec interpolation douce"  
  - "Structurer README pour TP jeu HTML5 Canvas avec bonnes pratiques et axes d'amélioration"

- Exemple réel de prompt :
  - > *Est-ce qu’il serait pertinent de créer une facade centrale pour les upgrades ?
L’idée serait que cette facade contienne toutes les upgrades disponibles, et qu’elle serve d’interface avec l’UpgradeRoller.
Concrètement : la facade appelle l’UpgradeRoller pour générer un choix d’upgrades, et lorsqu’un bonus est cliqué, c’est la facade qui applique directement l’upgrade au joueur.
Cela permettrait de centraliser la logique, de simplifier le code dans le joueur et dans l’UI, et de mieux séparer les responsabilités. T'en penses quoi ?*

## 9. Instructions pour lancer le jeu

*Le jeu est également jouable en ligne à l’adresse : <https://luisjuniora.github.io/Hazard-Arena/>*

1. Cloner le repository :  

   ```bash
   git clone https://github.com/LuisJuniorA/Hazard-Arena.git
   ```

2. Ouvrir `index.html` dans un navigateur supportant HTML5 Canvas.
3. Naviguer dans le menu et jouer aux niveaux.

> ⚠️ Le jeu fonctionne uniquement en local ou via un serveur HTTP (ex : Live Server VSCode) pour charger les assets correctement.
