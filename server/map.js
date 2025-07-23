const MAP_WIDTH = 15;

const MAP_HEIGHT = 15;
const WALL = 'WALL';
const BLOCK = 'BLOCK';
const EMPTY = 'EMPTY';
const POWERUP = 'POWERUP';

const { PowerUp, POWERUP_TYPES } = require('./PowerUp.js');
//players positions
const PLAYER_STARTS = [
    { x: 0, y: 0 },
    { x: MAP_WIDTH - 1, y: 0 },
    { x: 0, y: MAP_HEIGHT - 1 },
    { x: MAP_WIDTH - 1, y: MAP_HEIGHT - 1 }
];

class Map {
    constructor() {
        this.grid = this.generateMap();
        this.powerUps = []

    }

    generateMap() {
        const grid = Array.from({ length: MAP_HEIGHT }, () => Array(MAP_WIDTH).fill(BLOCK));
        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                if ((x == 0 || y == 0 || x == MAP_WIDTH - 1 || y == MAP_HEIGHT - 1) || (x % 2 === 0 && y % 2 === 0 && x !== MAP_WIDTH - 2 && y != MAP_HEIGHT - 2)) {
                    grid[y][x] = WALL;
                }
            }
        }

        for (let y = 1; y < MAP_HEIGHT - 1; y++) {
            for (let x = 1; x < MAP_WIDTH - 1; x++) {
                if (grid[y][x] === BLOCK && !this.isStartZone(x, y)) {
                    // if (!((x <= 3 &&  y == 0) || (y <= 3 && x == 0) || (y == 0 && x < MAP_WIDTH - 3) || (x == 0 && y < MAP_HEIGHT - 3))) {

                    if (((x > 3 && x < MAP_WIDTH - 4) && (y === 1 || y === MAP_HEIGHT - 2)) || y > 1 && y < MAP_HEIGHT - 2)
                        if (Math.random() < 0.7) {
                            grid[y][x] = EMPTY; // 70% chance
                        }







                }
            }
        }
        return grid;
    }

    isStartZone(x, y) {

        // return PLAYER_STARTS.some(pos => Math.abs(pos.x - x) <= 1 && Math.abs(pos.y - y) <= 1);
    }

    // isSafeZone(x, y) {
    //     if ((x <= 3 && y <= 3)  && (MAP_HEIGHT >= MAP_HEIGHT - 3 && MAP_WIDTH >= MAP_WIDTH -3))
    // }

    // destroyBlock(x, y) {
    //     if (this.grid[y][x] === BLOCK) {
    //         this.grid[y][x] = EMPTY;
    //         if (Math.random() < 0.3) this.grid[y][x] = POWERUP; //30% chance for powerup
    //         return true;
    //     }
    //     return false;
    // }

    destroyBlock(x, y) {
        if (this.grid[y][x] === EMPTY) {
            this.grid[y][x] = BLOCK;
            if (Math.random() < 0.3) { // 30% chance for powerup
                const powerUpType = PowerUp.getRandomType();
                const powerUp = new PowerUp(powerUpType, { x, y });
                this.powerUps.push(powerUp);
                console.log("PowerUp created at", x, y, "Type:", powerUpType);
                // this.grid[y][x] = POWERUP;
            }
            return true;
        }
        return false;
    }

    getCell(x, y) {
        return this.grid[y][x];
    }

    setCell(x, y, value) {
        this.grid[y][x] = value;
    }
    inMapBound(x, y) {
        return (x >= 1 && x < MAP_WIDTH) && (y >= 1 && y < MAP_HEIGHT)
    }

    getPowerUpAt(x, y) {
        return this.powerUps.find(powerUp => powerUp.position.x === x && powerUp.position.y === y);
    }

    removePowerUp(x, y) {
        const index = this.powerUps.findIndex(powerUp => powerUp.position.x === x && powerUp.position.y === y);
        if (index !== -1) {
            const powerUp = this.powerUps.splice(index, 1)[0];
            // this.grid[y][x] = EMPTY; // Clear the tile
            return powerUp;
        }
        return null;
    }

}


module.exports = Map