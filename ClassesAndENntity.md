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
