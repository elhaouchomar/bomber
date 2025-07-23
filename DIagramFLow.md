
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
