Rapport d’évaluation — Space Shooter 3D (Three.js)

# 1. Présentation générale du projet

Space Shooter 3D est un prototype de jeu spatial développé en Three.js, offrant une expérience immersive en 3D avec des interactions utilisateur multiples. Le joueur incarne un pilote dans un vaisseau spatial en vue FPS (First Person Shooter), dont l’objectif est de survivre, détruire des astéroïdes hostiles, accumuler des points et progresser à travers différents niveaux.

Le projet constitue un socle technique robuste pour le développement d’un jeu arcade complet en 3D, incluant la gestion des collisions, des tirs automatiques, des ennemis générés aléatoirement, et un système de niveaux configurable.

Le projet a été conçu pour répondre aux exigences pédagogiques de la ressource R5.D07, en intégrant des fonctionnalités interactives avancées, une interface utilisateur ergonomique, et une progression de jeu claire.


# 2. Fonctionnalités et conformité
## 2.1 Fonctionnalités implémentées

Le projet intègre les fonctionnalités suivantes, conformément au cahier des charges :

- Objets 3D manipulables :
Les astéroïdes et le vaisseau sont des objets 3D interactifs. Le joueur peut interagir avec son vaisseau pour se déplacer et tirer automatiquement sur les ennemis.

- Différents niveaux de difficulté paramétrables :
Le système de niveaux (utils.js) permet de configurer le nombre d’ennemis, la vitesse et le score minimum requis pour passer au niveau suivant.

- Progression dans le jeu :
Chaque niveau réussi débloque le suivant et met en pause le jeu pour une transition fluide.

- Système de score cumulé :
Les points sont attribués pour chaque ennemi détruit (+100 points), avec un suivi affiché en temps réel dans le HUD.

- Interactions utilisateur multiples :

- Souris : orientation du vaisseau (pointer lock)

- Clavier : déplacements avancés, recul, latéraux et verticaux

- GUI : éléments interactifs pour passer au niveau suivant

Argumentation : Le projet respecte pleinement le critère de conformité fonctionnelle. Toutes les fonctionnalités clés attendues dans une application Three.js interactive sont présentes et opérationnelles.

## 2.2 Stabilité et compatibilité

- Le projet est testé sur les navigateurs modernes (Chrome, Firefox, Edge).

- Les collisions et la génération aléatoire des ennemis fonctionnent sans bugs critiques.

- Les performances restent stables même avec des niveaux comportant un grand nombre d’astéroïdes.

Argumentation : La stabilité et la compatibilité sont assurées, répondant aux attentes pédagogiques sur la qualité technique.

# 3. Qualité de l’interface et expérience utilisateur
## 3.1 Modèles 3D et textures

- Les astéroïdes sont générés avec des formes irrégulières (Icosahedron) et des tailles variées pour créer un rendu visuellement intéressant et réaliste.

- Le vaisseau et les tirs lasers sont modélisés pour une clarté maximale, même à grande vitesse.

## 3.2 Interface utilisateur et interactions

- HUD clair et ergonomique : Score, temps, niveau et réticule central.

- Interface de fin de niveau : affiche le score et permet de passer au niveau suivant via un bouton interactif.

- Navigation intuitive : les commandes clavier et souris sont standardisées et immédiatement compréhensibles.

## 3.3 Expérience globale

- L’expérience est immersive grâce à la vue FPS et à l’interaction directe avec les objets 3D.

- Les niveaux progressifs et le système de score encouragent le joueur à s’améliorer et à continuer l’expérience.

Argumentation : L’expérience utilisateur est au cœur du projet, répondant aux critères de clarté, d’ergonomie et d’immersion. Le joueur est guidé par une interface simple mais complète, ce qui respecte pleinement les exigences de la section 2.2 du document de référence.

# 4. Originalité et créativité

- Thème spatial original : Le projet s’écarte d’un simple puzzle pour proposer un jeu arcade complet en 3D.

- Interactions variées et dynamiques : Combinaison de tirs automatiques, mouvements tridimensionnels et génération aléatoire d’ennemis.

- Système de niveaux modulable : Permet d’étendre le jeu avec des fonctionnalités supplémentaires (niveaux bonus, ennemis spéciaux, power-ups, etc.).

Argumentation : Le projet démontre une réflexion avancée sur l’interactivité et la progression du joueur, ce qui dépasse les attentes minimales et valorise la créativité technique et conceptuelle.

# 5. Liens avec les critères d’évaluation

| Critère d’évaluation                    | Réalisation dans Space Shooter 3D                                                                                                         |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Fonctionnalité et conformité**        | Toutes les fonctionnalités demandées sont présentes et opérationnelles, respectant le cahier des charges.                                 |
| **Stabilité et compatibilité**          | Tests effectués sur navigateurs modernes, aucune instabilité majeure.                                                                     |
| **Interface et expérience utilisateur** | HUD clair, navigation intuitive, retour visuel sur les actions du joueur, interface de fin de niveau fonctionnelle.                       |
| **Originalité et créativité**           | Thème spatial interactif, progression par niveaux, interactions multiples (tir automatique, mouvements 3D).                               |
| **Présentation orale**                  | Le projet peut être facilement présenté avec démonstration en temps réel, montrant les fonctionnalités clés et le système de progression. |

# 6. Conclusion

Space Shooter 3D constitue un projet solide et complet pour la ressource R5.D07. Il répond à tous les critères d’évaluation :

- Fonctionnalités implémentées et conformes au cahier des charges

- Expérience utilisateur intuitive et immersive

- Stabilité et compatibilité assurées

- Originalité et créativité dans le concept et les interactions

Le projet est prêt à être présenté lors des soutenances, avec la possibilité de démontrer les fonctionnalités en temps réel, expliquer la structure technique et justifier les choix de design et d’interactivité.