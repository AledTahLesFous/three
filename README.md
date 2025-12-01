# Space Shooter 3D — Prototype

Bienvenue dans **Space Shooter 3D**, un prototype de jeu de tir spatial en **Three.js** avec un système de niveaux, un HUD complet, un joueur contrôlable façon FPS, des tirs lasers et des vagues d’astéroïdes hostiles.

Ce projet est un **premier socle technique** pour construire un vrai jeu 3D arcade dans l’espace.

---

# Gameplay

Vous incarnez un pilote à bord d'un vaisseau spatial en vue **FPS (First Person Shooter)**.  
Votre objectif : **survivre, détruire les astéroïdes ennemis, faire le meilleur score et débloquer les niveaux**.

## Contrôles

| Action | Touche |
|--------|--------|
| Avancer | W |
| Reculer | S |
| Aller à gauche | A |
| Aller à droite | D |
| Monter | Espace |
| Descendre | Shift Gauche |
| Orientation | Souris (pointer lock) |
| Tirer | Automatique (2 tirs/seconde) |

---

# Système de tir

Le vaisseau tire automatiquement :

- 2 tirs par seconde  
- Deux lasers parallèles  
- Alignés sur la direction réelle du joueur (inclinaison haut/bas incluse)  
- Les tirs détruisent progressivement les ennemis (HP)

---

# Ennemis : Astéroïdes hostiles

Les ennemis sont :

- générés de manière aléatoire dans l’espace  
- de formes irrégulières (Icosahedron)  
- de tailles et points de vie variables  
- attirés vers le joueur  
- de plus en plus rapides selon les niveaux

Lorsqu’un ennemi est détruit → +100 points.

---

# Système de niveaux

Le jeu comporte déjà un **Level System** configurable dans `utils.js`.

Chaque niveau impose :

- un score minimum  
- un temps limite optionnel  
- un nombre d’ennemis croissant  

Lorsqu’un niveau est réussi :

- La partie se **met automatiquement en pause**  
- Un **HUD futuriste** apparaît au centre de l’écran  
- Le joueur peut cliquer sur **"Continuer"** pour passer au niveau suivant  
- Le niveau suivant se **débloque** automatiquement

---

# HUD (Interface)

Le HUD affiche :

- Score  
- Temps  
- Niveau  
- Un réticule (crosshair) au centre

Le HUD de fin de niveau affiche :

- Score obtenu  
- Temps réalisé  
- Un bouton “Niveau suivant”

---

# Architecture du projet

