# 💣 Bomberman DOM – Microtasks & Implementation Plan

This file contains detailed microtasks for building a multiplayer Bomberman game using DOM (no canvas), Node.js, and WebSockets. Follow this structured list to build confidently in 3 days.

---

## 📁 1. Setup & Initialization

### ✅ Task 1.1: Initialize Project Structure
- **What:** Create folder structure
- **Why:** Clean separation of concerns
- **How:**
  - `/client`: frontend HTML/CSS/JS
  - `/server`: Node.js + WebSocket backend
  - `/shared`: shared constants or types

### ✅ Task 1.2: Install Dependencies
- **What:** Install backend tools
- **Why:** Required for server + socket communication
- **How:**
  ```bash
  npm init -y
  npm install express ws
✅ Task 1.3: Setup Express Static Server
What: Serve client files

Why: Enables game in browser

How:

In server.js:

js
Copy
Edit
const express = require('express');
const app = express();
app.use(express.static('client'));
🧱 2. Game Map System
✅ Task 2.1: Map Grid Generation
What: Create 2D grid for the map

Why: Core world structure

How:

Use 2D array

Tiles: 0 = wall, 1 = block, 2 = ground, 'p' = power-up

✅ Task 2.2: Random Block Placement
What: Add breakable blocks randomly

Why: Gameplay variability

How:

Add random 1 blocks with probability

Keep spawn areas clear

✅ Task 2.3: Safe Spawn Zones
What: Leave spawn areas open

Why: Prevent unfair starts

How:

Clear at least 3x3 space at each corner

✅ Task 2.4: Map Utility Functions
What: Add helper methods

Why: Needed by player & explosion logic

How:

js
Copy
Edit
isWalkable(x, y)
destroyBlock(x, y)
placePowerUp(x, y)
🧍‍♂️ 3. Player System
✅ Task 3.1: Player Class / Object
What: Represents a player

Why: Track position, lives, stats

Props:

id, position, lives, stats

stats: { speed, bombCount, range }

✅ Task 3.2: Movement Logic
What: Allow directional movement

Why: Core input mechanic

How:

On input: check isWalkable(x, y)

Update player.position

✅ Task 3.3: Bomb Placement
What: Lay bomb on spacebar

Why: Main action

How:

Check current bomb count

Add bomb to GameState.bombs[]

✅ Task 3.4: Power-Up Pickup
What: Player steps on power-up

Why: Buffs player

How:

On move, check tile

If 'p', apply stat and clear tile

💣 4. Bombs & Explosions
✅ Task 4.1: Bomb Entity
What: Represent a bomb

Props: position, range, ownerId, timer

How:

Start timer when placed

Trigger explosion after 2s

✅ Task 4.2: Explosion System
What: Destroy blocks, damage players, chain bombs

How:

Propagate in 4 directions until wall or limit

If another bomb hit → explode it

Damage players within range

✅ Task 4.3: Destroy Blocks + Power-Ups
What: Block → destroyed → maybe drops power-up

Why: Progression + reward

How:

On destruction: 20–30% chance for 'p' tile

Add to map

✅ Task 4.4: Player Damage & Death
What: Reduce lives if hit

Why: Enable win condition

How:

If explosion hits player → lives--

If lives <= 0 → remove player

🧠 5. Game State Management (Server)
✅ Task 5.1: GameState Class
Props:

players[], map, bombs[], phase

How:

addPlayer(), removePlayer()

handleInput(id, input)

tick() → main loop

✅ Task 5.2: Game Loop (tick())
What: 30ms interval game updates

Why: Drive game logic

How:

js
Copy
Edit
setInterval(() => gameState.tick(), 30);
✅ Task 5.3: Game Snapshot
What: Emit snapshot of game state

Why: Sync all players

How:

Collect all map, players, bombs

Send via socket.send("gameSnapshot", data)

🌐 6. WebSocket Communication
✅ Task 6.1: Connect + Join
What: Handle new player connections

Why: Entry point to game

How:

Ask for nickname

Assign corner spawn and ID

✅ Task 6.2: Input Events
What: Handle:

move, layBomb, chat

Why: Translate UI actions into game logic

How:

On input → socket.emit("move", {dir})

Server: validate and update player.position

✅ Task 6.3: Game Phases
What: "waiting" → "running" → "ended"

Why: Show countdowns, handle restarts

How:

Start when 2–4 players join or timer runs out

🎮 7. Frontend – Rendering & State
✅ Task 7.1: useState Hook
What: Build/use custom useState

Why: DOM reactivity

State to manage:

gameState, localPlayer, chatLog

✅ Task 7.2: DOM Renderer
What: Draw tiles, players, bombs

Why: Visual feedback

How:

Use div for each tile

Position players with style.left/top

✅ Task 7.3: requestAnimationFrame Loop
What: Run every frame

Why: Smooth updates

How:

js
Copy
Edit
function gameLoop() {
  updateDOM();
  requestAnimationFrame(gameLoop);
}
✅ Task 7.4: DOM Diffing
What: Only update changed elements

Why: Performance

How:

Compare previous and current state

Update styles (not innerHTML)

🎮 8. Input Handling
✅ Task 8.1: Keyboard Controls
What: Arrow keys = move, Space = bomb

How:

Capture keydown

Send to server via WebSocket

✅ Task 8.2: Local Prediction
What: Move instantly on client

Why: Reduce input lag

How:

Optimistically move player

Overwrite from server snapshot

💬 9. Chat System
✅ Task 9.1: UI
What: Input + chat display

How:

Input field → submit on enter

Display messages in a scroll box

✅ Task 9.2: WebSocket Events
What: chat → send and receive

How:

socket.emit("chat", {text})

Append to chatLog on client

🏁 10. Endgame Logic
✅ Task 10.1: Victory Detection
What: Game ends when 1 player remains

How:

If alivePlayers.length === 1 → winner

✅ Task 10.2: Display Winner
What: Show winner UI

How:

Overlay screen with Player X wins!

✅ Task 10.3: Reset Game
Optional

What: Allow restart or refresh

How:

Reset GameState

Reload frontend or emit startNewGame

🧪 11. Testing & Optimization
✅ Task 11.1: Manual Gameplay Test
Checklist:

Players can move

Bombs explode correctly

Deaths and power-ups trigger

✅ Task 11.2: Performance Test
What: Optimize large maps or 4 players

How:

Profile DOM update loop

Debounce rerenders

✅ Task 11.3: Code Cleanup
Checklist:

Remove logs

Use constants

Split files if needed

📌 Final Notes
Use DOM-based visuals (div per tile)

Avoid canvas or external rendering libraries

Target: 2–4 players per game

Focus on smooth updates and responsiveness

