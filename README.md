# Greboo — jeu plateforme (Vue 3 + TypeScript + Vite)

Description
-: Petit jeu de plateforme créé avec Vue 3, TypeScript et Vite. Le dépôt contient le moteur de jeu, les assets, et l'interface (menu, scoreboard, contrôles tactiles).

Points clés
-: Moteur de jeu en TypeScript organisé sous `src/game`
-: Interface utilisateur en Vue Single-File Components sous `src/components`
-: Assets et maps Tiled dans `public/` et `src/game/assets`

Prérequis
-: Node.js (>=16) et `npm` ou `pnpm`

Installation

```powershell
npm install
```

Lancer en mode développement

```powershell
npm run dev
```

Générer une build de production

```powershell
npm run build
```

Servir la build localement (après `build`)

```powershell
npm run preview
```

Structure du projet (sélection)
-: `index.html` — page d'entrée
-: `src/main.ts` — point d'entrée de l'application Vue
-: `src/components/` — écrans UI (menu, loading, scoreboard, joystick)
-: `src/game/` — code du jeu (engine, player, ennemis, scènes, loader)
-: `public/` — maps Tiled et spritesheets

Commandes et raccourcis
-: Déplacement joueur: flèches / pad virtuel
-: Saut: `space` ou bouton tactile (virtual joystick)

Développement et debug
-: Le projet contient un dossier `src/game/debug` pour outils de collision et visualisation.
-: Pour ajouter une map Tiled, placez le `.tmj`/`.tmx` et les assets associés dans `public/` puis mettez à jour le loader si nécessaire.

Crédits
-: Auteur: LeoRousseau
