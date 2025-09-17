# Aha Vehicle Care — Scooter Sprint Mini Game

This repository contains a Next.js 15 + React 19 app with a lightweight HTML5 Canvas racing mini-game accessible at `/racing`.

## Run locally

1. Install dependencies

```bash
npm install
```

2. Start the dev server (Turbopack)

```bash
npm run dev
```

3. Open the app

Visit http://localhost:3000, then navigate to http://localhost:3000/racing to play the mini game.

## Game overview

- Theme: Casual scooter race on a sunny city loop.
- Rendering: HTML5 Canvas for gameplay with React UI overlay (HUD, minimap, buttons).
- Input:
  - Mobile: drag left/right on the canvas to steer; tap the Boost button to boost.
  - Desktop: A/D or Left/Right to steer; Space to Boost; P/Esc to pause.
- Objective: Complete 3 laps and finish first.
- Collectibles: Coins on the track add to your global coins.
- Power-up: Short speed boost with cooldown and visual trail.
- AI: Two opponents with lane-following, mild rubber-banding, and occasional boosts.

## Controls (quick)
- A/D or ←/→: steer
- Space or Boost button: activate boost
- P or Esc: pause

## Files of interest
- Route: `src/app/racing/page.tsx`
- Canvas renderer: `src/components/game/GameCanvas.tsx`
- HUD: `src/components/game/HUD.tsx`
- Minimap: `src/components/game/MiniMap.tsx`
- Boost button: `src/components/game/BoostButton.tsx`
- Victory overlay: `src/components/game/VictoryOverlay.tsx`
- Game core loop/state: `src/game/core/engine.ts`
- World/track helpers: `src/game/core/world.ts`
- Opponent AI: `src/game/core/ai.ts`

## Assets
- The game uses simple vector drawing on Canvas for scooters/track.
- UI icons reference small PNGs under `public/` (e.g., `ic_aha_coin.png`). You can replace these with your own assets if desired.

## Notes
- State is mobile-first and aims for smooth 60 FPS on mid devices.
- Player coins are persisted in localStorage via the shared game store.
- Basic console telemetry logs race finish events.
