# 💣 Bomberman-DOM

A DOM-only multiplayer Bomberman-style game using WebSockets and a custom MiniFramework (no canvas, no external frameworks).  
Supports 2–4 players. Built for performance (60FPS+), real-time interaction, and custom game logic.

---

## 📌 Project Scope

- Multiplayer DOM-based Bomberman game
- Built with JavaScript + Node.js
- Uses MiniFramework: [`https://github.com/HaFiid98/MiniFramework`](https://github.com/HaFiid98/MiniFramework)
- No Canvas or WebGL — pure DOM rendering
- Real-time communication via WebSocket (chat + game sync)
- Game logic: movement, bombs, explosions, power-ups, lives
- Game ends when one player remains

---

## 🧠 Architecture Overview

### Client
- Renders game map via DOM grid
- Manages state via custom `useState`
- Captures input → sends actions to server
- Receives and applies game snapshots (tick updates)

### Server
- Hosts WebSocket logic
- Maintains authoritative `GameState`
- Runs game tick loop (~30fps)
- Validates input, calculates state changes
- Sends snapshots to clients

---

## 🧱 Class Diagram (Text Format)


    ┌────────────┐
    │ GameState  │
    └────────────┘
      ▲     ▲     ▲
      │     │     │
┌─────────┘ │ └──────────┐
│ │ │
│ ▼ ▼
│ ┌────────────┐ ┌────────────┐
│ │ Player │ │ Bomb │
│ └────────────┘ └────────────┘
│ ▲ ▲
│ │ │
│ ┌────────────┐ ┌────────────┐
│ │ PowerUp │ │ Explosion │
│ └────────────┘ └────────────┘
│
└─────────────────────────────────────┐
▼
┌────────────┐
│ Map │
└────────────┘

markdown
Copy
Edit

---

## 🧩 Entity Design

### GameState
- `players[]`: Active players
- `bombs[]`: Active bombs
- `map`: 2D grid map (static walls, destructible blocks, ground)
- `phase`: `"waiting" | "running" | "ended"`
- `tick()`: Game loop logic
- `sendSnapshot()`: Push full game state to all clients

### Player
- `id`, `position`, `stats`, `lives`
- `move(dir)`: Tries to move player
- `layBomb()`: Places a bomb if allowed

### Bomb
- `position`, `range`, `ownerId`
- Explodes after 2s
- On explosion → calls `Explosion`

### Explosion
- Propagates in 4 directions
- Destroys blocks
- Hurts players
- Triggers chain bombs

### PowerUp
- Spawns from destroyed blocks
- Types: `bomb`, `flame`, `speed`

### Map
- 2D grid: wall = 0, block = 1, ground = 2, power-up = "p"
- Utilities:
  - `isWalkable(x, y)`
  - `destroyBlock(x, y)`
  - `placePowerUp(x, y)`

---

## ✅ Microtask Tracker

### 🔹 Setup & Project Structure
- [ ] Setup project folders: `client`, `server`, `shared`
- [ ] Install WebSocket and Express
- [ ] Setup basic MiniFramework on client

### 🔹 GameState (server)
- [ ] `players[]`: join/leave logic
- [ ] `map`: create map with walls + random blocks
- [ ] `bombs[]`: track active bombs
- [ ] `phase`: track game state
- [ ] `tick()`: run logic every 30ms
- [ ] `sendSnapshot()`: emit to clients

### 🔹 Map (server)
- [ ] Init 2D grid
- [ ] Place static walls (0)
- [ ] Random blocks (1)
- [ ] Ensure safe spawn zones
- [ ] Methods: `isWalkable`, `destroyBlock`, `placePowerUp`

### 🔹 Player (server)
- [ ] Properties: `id`, `position`, `stats`, `lives`
- [ ] Method: `move()`: handles collision
- [ ] Method: `layBomb()`: limited by stats

### 🔹 Bomb & Explosion
- [ ] Create `Bomb` with `ownerId`, `range`
- [ ] Set 2s timer → triggers explosion
- [ ] Explosion propagates in 4 directions
- [ ] Affects players, blocks, power-ups

### 🔹 PowerUps
- [ ] Chance to spawn when a block is destroyed
- [ ] Types: bomb count, flame range, speed
- [ ] Collected on player step

---

## 🕹 Frontend Tasks

### 🔹 State Management
- [ ] `useState()` → manage:
  - `gameState`
  - `localPlayer`
  - `map`
  - `chatLog`
- [ ] `setGameState(snapshot)` from server tick

### 🔹 Game Loop
- [ ] `requestAnimationFrame` loop
- [ ] Update player positions
- [ ] Render bombs + explosions
- [ ] Only update changed DOM nodes

### 🔹 Input Handler
- [ ] Arrow keys → send `move` signal
- [ ] Spacebar → send `layBomb` signal

### 🔹 DOM Renderer
- [ ] Grid renderer (wall, block, ground, power-up)
- [ ] Dynamic rendering for players and bombs
- [ ] Reuse divs when possible for performance

### 🔹 Chat UI
- [ ] Input field + submit button
- [ ] Display message list
- [ ] Socket: send + receive messages

---

## 🔁 Game Flow Logic

1. On client connect → enter nickname
2. Server adds player → sends to waiting room
3. When 2–4 players connected → start 20s countdown
4. If 4 players before 20s → skip to 10s "get ready"
5. Game starts → map + player snapshot sent
6. Players move, lay bombs
7. Game tick runs every 30ms → calculates game logic
8. Server sends updated gameSnapshot
9. Game ends when 1 player remains → winner screen

---

## ⚙️ Folder Structure

/bomberman-dom
├── client
│ ├── index.html
│ ├── game.js
│ ├── dom.js
│ ├── input.js
│ └── MiniFramework/
├── server
│ ├── server.js
│ ├── GameState.js
│ ├── Player.js
│ ├── Map.js
│ ├── Bomb.js
│ ├── Explosion.js
│ └── PowerUp.js
└── shared
└── constants.js

yaml
Copy
Edit

---

## 🧪 Performance & Testing

### Testing Goals
- [ ] Simulate 4 players via multiple tabs or dummy clients
- [ ] Bomb explosion + power-up logic
- [ ] Victory conditions
- [ ] Chat broadcast reliability

### Performance
- [ ] Maintain 60FPS (`performance.now()`)
- [ ] DOM optimization:
  - [ ] Avoid full re-renders
  - [ ] Update only changed positions
- [ ] Debounce high-frequency input
- [ ] Minimize snapshot diff

---

## 📦 Snapshot Format Example

```js
{
  phase: 'running',
  map: [[0,2,1,2], [0,2,'p',2], ...],
  players: [
    { id: 'p1', position: {x:0, y:0}, lives: 3, stats: {...} },
    ...
  ],
  bombs: [
    { position: {x:1, y:1}, ownerId: 'p1', timer: 1200 }
  ]
}