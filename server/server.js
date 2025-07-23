const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');
const GameHandle = require("./Gamestate.js");
const Player = require("./Player.js");
const Mapp = require("./map.js");

class Socket {
  constructor(wsss) {
    this.clients = new Map()
    this.wss = wsss;
    this.MakeAndConnect(this.wss);
  }

  SendToClient(id, data) {
    const cl = this.clients.get(id)
    if (cl.readyState === WebSocket.OPEN) { cl.send(data) }
  }
  SendData(data) {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {

        client.send(data);
      }
    });
  }

  MakeAndConnect(wss) {
    wss.on("connection", (ws) => {
      const ClientId = Math.floor(Date.now() * Math.random()).toFixed()
      this.clients.set(ClientId, ws)
      this.SendToClient(ClientId, JSON.stringify({ signal: "ClientId", ClientId: ClientId }))
      this.ws = ws;
      gameHandler.ws = this; // Link gameHandler to this socket

      this.ws.on("message", (message) => {
        const data = JSON.parse(message);

        switch (data.signal) {
          case "NewUser":
            if (!gameHandler.map) {
              gameHandler.map = new Mapp();
            }
            const pl = new Player(data.name, gameHandler.map, gameHandler.PlayersPos[gameHandler.players.length], ClientId);
            gameHandler.addplayer(pl);
            gameHandler.phase = "waiting"
            this.SendToClient(ClientId, JSON.stringify({ signal: "enableChat" }))
            break;

          case "PlayerMovement":
            const Direction = JSON.parse(message).Direction;
            const movingPlayer = gameHandler.players.find(p => p.id == (JSON.parse(message).ClientId));
            if (movingPlayer) {
              movingPlayer.move(Direction, gameHandler.activeBombs.map(b => b.position));
            } else {
              console.warn('Player not found for movement:', JSON.parse(message).ClientId);
            }
            break;

          case "Bomb":
            const currentPlayer = gameHandler.players.find(p => p.id == (JSON.parse(message).ClientId))

            if (
              gameHandler.activeBombs.filter(
                b => currentPlayer.id == b.ownerId
              ).length < currentPlayer.stats.bCount
            ) {
              const bmb = currentPlayer.layBomb();
              gameHandler.activeBombs.push(bmb);
              let bombData = [1, 1, 1, 1]
              setTimeout(() => {
                const Explode = (range) => {
                  for (let i = 1; i <= range; i++) {
                    // Directions: down, up, right, left
                    if (bombData[0] === 1 && gameHandler.map.inMapBound(bmb.position.x, bmb.position.y + i) &&
                      ["EMPTY", "WALL"].includes(gameHandler.map.grid[bmb.position.y + i][bmb.position.x])) {
                      gameHandler.map.grid[bmb.position.y + i][bmb.position.x] === "WALL" ? bombData[0] = 0 : false;
                      gameHandler.map.destroyBlock(bmb.position.x, bmb.position.y + i)
                    }
                    if (bombData[1] === 1 && gameHandler.map.inMapBound(bmb.position.x, bmb.position.y - i) &&
                      ["EMPTY", "WALL"].includes(gameHandler.map.grid[bmb.position.y - i][bmb.position.x])) {
                      gameHandler.map.grid[bmb.position.y - i][bmb.position.x] === "WALL" ? bombData[1] = 0 : false;

                      gameHandler.map.destroyBlock(bmb.position.x, bmb.position.y - i)
                    }
                    if (bombData[2] === 1 && gameHandler.map.inMapBound(bmb.position.x + i, bmb.position.y) &&
                      ["EMPTY", "WALL"].includes(gameHandler.map.grid[bmb.position.y][bmb.position.x + i])) {
                      gameHandler.map.grid[bmb.position.y][bmb.position.x + i] === "WALL" ? bombData[2] = 0 : false;
                      gameHandler.map.destroyBlock(bmb.position.x + i, bmb.position.y)
                    }
                    if (bombData[3] === 1 && gameHandler.map.inMapBound(bmb.position.x - i, bmb.position.y) &&
                      ["EMPTY", "WALL"].includes(gameHandler.map.grid[bmb.position.y][bmb.position.x - i])) {
                      gameHandler.map.grid[bmb.position.y][bmb.position.x - i] === "WALL" ? bombData[3] = 0 : false;
                      gameHandler.map.destroyBlock(bmb.position.x - i, bmb.position.y)

                    }

                    gameHandler.players.forEach(pl => {
                      if (
                        ((pl.position.x === bmb.position.x && pl.position.y === bmb.position.y) && i === 1) ||
                        (pl.position.x === bmb.position.x + i && pl.position.y === bmb.position.y) ||
                        (pl.position.x === bmb.position.x - i && pl.position.y === bmb.position.y) ||
                        (pl.position.x === bmb.position.x && pl.position.y === bmb.position.y + i) ||
                        (pl.position.x === bmb.position.x && pl.position.y === bmb.position.y - i)
                      ) {
                        pl.lives -= 1;
                        if (pl.lives === 0) { gameHandler.removeplayer(pl.id) }
                      }

                      console.log("liiiifes", pl.lives);
                    });
                  }
                };

                Explode(currentPlayer.stats.range);
                gameHandler.activeBombs = gameHandler.activeBombs.filter(
                  b => b.ownerId != bmb.ownerId
                );
              }, 2000);
            }
            break;

          case "ChatMessage":
            // // Diffuser le message à tous les joueurs
            // wss.clients.forEach(client => {
            //   if (client.readyState === WebSocket.OPEN) {
            //     client.send(JSON.stringify({

            //     }));
            //   }
            // });

            this.SendData(JSON.stringify({
              signal: "ChatMessage",
              message: (data.message),
              player: gameHandler.players.find(pl => pl.id == data.ClientId).name || "unknown"
            }))

            // const mmm = JSON.stringify({
            //         signal: "ChatMessage",
            //         message: data.message,
            //         name: data.name || gameHandler.players.find(p => p.id === data.ClientId)?.name || "Unknown",
            //         // ClientId: data.ClientId
            //       })


            break;
        }
      });

      this.ws.on("close", () => {
        console.log('Client disconnected');
        // Trouver l'id du client déconnecté
        const disconnectedId = ClientId;
        // Retirer le joueur du jeu
        gameHandler.removeplayer(disconnectedId);
        // Si la partie est en cours et qu'il ne reste qu'un joueur, terminer la partie
        if (gameHandler.phase === "running" && gameHandler.players.length === 1) {
          gameHandler.phase = "ended";
        }
      });
    });
  }
}

// === Initialize server properly ===
const wss = new WebSocket.Server({ port: 5500 });
var gameHandler = new GameHandle(null);   // Create the global Gamestate instance
const ws = new Socket(wss);               // Create WebSocket manager
gameHandler.ws = ws;                      // Link Gamestate to the WebSocket manager
