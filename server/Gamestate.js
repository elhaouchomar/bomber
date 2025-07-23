const { log, time } = require("node:console")

class Gamestate {
    constructor(ws) {
        this.id = Math.random()
        this.ws = null
        this.players = []
        this.activeBombs = []
        this.map = null
        this.phase = "waiting"
        this.tick()
        this.countdown = 5000
        this.roomTimout = 7000
        this.PlayersPos = {
            0: { x: 1, y: 1 },
            1: { x: 1, y: 13 },
            2: { x: 13, y: 13 },
            3: { x: 13, y: 1 }
        }
    }

    addplayer(player) {
        if (this.players.length < 4) {
            this.players.push(player)
        }

    }
    removeplayer(playerId) {
        this.players = this.players.filter(p => p.id !== playerId)

    }

    takeSnapshot() {
        // Détection du gagnant ou loose pour tous
        if (this.phase === "running") {
            if (this.players.length === 1) {
                this.phase = "ended";
            } else if (this.players.length === 0) {
                this.phase = "ended";
            }
        }
        const Timer = (this.phase === "waiting" && this.roomTimout < 7000 && this.roomTimout > 0) ?
            this.roomTimout : (this.phase === "waiting" && this.countdown < 5000 && this.countdown > 0)
                ? this.countdown : -1
        const snapShot = { players: this.players, phase: this.phase, bombs: this.activeBombs, map: this.map, timer: Timer };
        // Ajout du winnerId si la partie est finie
        if (this.phase === "ended" && this.players.length === 1) {
            snapShot.winnerId = this.players[0].id;
        }
        // Ajout loose pour tous si aucun gagnant
        if (this.phase === "ended" && this.players.length === 0) {
            snapShot.winnerId = null;
        }
        this.ws.SendData(JSON.stringify({ signal: "Snap", data: snapShot }))
    }
    tick() {
        setInterval(() => {
            // this.countdown -= 1000/30
            if (this.players.length >= 2 && this.players.length < 4 && this.roomTimout > 0) { this.roomTimout -= 1000 / 30 }
            else if ((this.players.length === 4 || this.roomTimout <= 0) && this.countdown > 0) {
                this.roomTimout = 0
                this.countdown -= 1000 / 30
            }
            else if (this.countdown <= 0) { this.phase = "running" }
            this.takeSnapshot()
        }, 1000 / 30);
    }
}
module.exports = Gamestate
