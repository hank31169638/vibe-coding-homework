主要的方式是使用prompt to prompt 的方式生成 vibe coding 的專案

首先先向 Gemini 說明：
我要透過 AI agent 製作一個貪吃蛇遊戲，替我生成prompt

以下是Gemini生成的prompt

```text
Role: Senior
Full Stack Developer & Game Designer.

Objective:
Build a high-fidelity "Vibe Snake" game with a Neon aesthetic. Constraint:
You MUST strictly follow the existing project file structure shown
below.

1. Project Structure (Strict Enforcement)
The project is a Monorepo-like structure.
Place code in these specific directories:

 shared/: Shared types and database schemas.
  schema.ts: Define User/Score tables using drizzle-orm/pg-core.

 server/: Express backend.
  routes.ts: API endpoints (e.g., POST /api/scores).
  storage.ts: Data storage implementation (use MemStorage interface pattern).

 client/: React Frontend.
  src/lib/stores/: Zustand stores (useSnakeGame.tsx, useAudio.tsx).
  src/components/: UI components (GameCanvas, GameUI).
  src/pages/: Main page views.

 2. Tech Stack
 Frontend: React 18, TypeScript, Vite, Tailwind CSS, Radix UI, Zustand.
 Backend: Express.js.
 Database/ORM: Drizzle ORM (use pgTable, serial, text, integer).
 Visuals: HTML5 Canvas API for high-performance rendering.

3. Game Mechanics (The "Special Sauce")
 Grid: 20x20.
 Food System (RNG Mechanics):
  🔴 Normal (Red): +10 points (70% chance).
  🟡 Double Points (Gold): +20 points (20% chance).
  🔵 Slow Effect (Blue): Slows down game speed by 1.5x for limited ticks (10% chance).

 Difficulty: Easy/Medium/Hard (adjusts base tick rate).
 Audio: Sound effects for interactions (use placeholders or synthesized sounds if assets missing).

4. Implementation Priority
Please generate the full code for the following files in this order:

 shared/schema.ts: Define the score/user schema.
 client/src/lib/gameLogic.ts: Pure functions for collision and random food generation.
 client/src/lib/stores/useSnakeGame.tsx: The core game engine using Zustand. Must handle the Slow Effect logic (state multiplier).
 client/src/components/GameCanvas.tsx: The renderer using useRef<HTMLCanvasElement> and requestAnimationFrame. Add Glow Effects (ShadowBlur) to the snake and food.
 client/src/components/SnakeGame.tsx: The main container handling keyboard inputs and the Game Loop interval.
輸入prompt後，遊戲的核心機制（移動、吃食物、特殊道具）都已經正常運作。但整體視覺效果很乾，於是我提出可改進的缺點，如下

缺乏視覺引導：畫面只顯示分數，沒有清楚告訴玩家難度、聲音是開還是關。

按鈕風格不統一：開始/暫停按鈕只是普通的 HTML 按鈕，沒有現代感，跟遊戲風格不搭。

提出後Gemini 生成以下指令

Plaintext

# Role: Senior Gameplay Programmer & UX Designer

**Current Status:** We have a basic React + Zustand project structure set up for a Snake game. 
**Objective:** Implement advanced game mechanics and audio systems to transform this into a "Vibe Snake" experience. 

## 1. Feature Implementation: Advanced Food System (RNG) 
Modify `client/src/lib/gameLogic.ts` and `useSnakeGame.tsx` to replace the standard food logic with a weighted random system: 
* **Generate Logic:** * **70% Chance:** 🔴 **Normal Food (Red)** -> Score +10. 
* **20% Chance:** 🟡 **Double Points (Gold)** -> Score +20. 
* **10% Chance:** 🔵 **Slow Effect (Blue)** -> Apply a "Time Dilation" effect (slow down game tick by 1.5x) for 5-10 moves. 
* **Visuals:** Update `GameCanvas.tsx` to render these distinct colors. Draw floating text labels ("x2", "S") above special foods for clarity. 

## 2. Feature Implementation: Difficulty & Game Loop 
Refactor the game loop in `SnakeGame.tsx` and `useSnakeGame.tsx`:
* **Difficulty Settings:** * *Easy:* 200ms tick. 
* *Medium:* 150ms tick. 
* *Hard:* 100ms tick. 
* **Dynamic Speed:** The `setInterval` delay must react dynamically. If `slowEffect > 0` (active), multiply the current difficulty delay by 1.5 to create the slow-motion effect. 

## 3. Feature Implementation: Audio System 
Update `client/src/lib/stores/useAudio.tsx` and integration: 
* Manage `HTMLAudioElement` instances for: 
1. `BackgroundMusic` (Looping). 
2. `EatSound` (Play on food collision). 
3. `GameOverSound` (Play on wall/self collision). 
* Add global Mute/Unmute toggle in `GameUI.tsx`. 

## 4. UI Refinement 
Update `client/src/components/GameUI.tsx`:
* Add a **Difficulty Selector** (Toggle Group) visible only when `gameState` is 'ready' or 'gameOver'. 
* Display **High Score** (persist to `localStorage`). 
* Ensure all buttons use the "Neon/Dark" aesthetic defined in Tailwind config. 

**Constraint:** Do not break the existing Monorepo structure. Focus on logic expansion within `client/src/`.
後我的專案就完成了
