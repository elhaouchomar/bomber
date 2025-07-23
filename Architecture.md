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

markdown
Copy
Edit
    ┌────────────┐
    │ GameState  │
    └────────────┘
      ▲     ▲     ▲
      │     │     │
┌─────────┘ │ └──────────┐
│     │            │
│     ▼            ▼
│ ┌────────────┐ ┌────────────┐
│ │ Player     │      Bomb    │
│ └────────────┘ └────────────┘
│ ▲                    ▲
│ │                    │
│ ┌────────────┐ ┌────────────┐
│ │ PowerUp │  │ Explosion     │
│ └────────────┘ └────────────┘
│
└─────────────────────────────────────┐
                                      ▼
                                ┌────────────┐
                                │ Map         │
                                └────────────┘