const POWERUP_TYPES = {
  SPEED: 'speed',
  RANGE: 'range', 
  BOMB: 'bomb'
};

class PowerUp {
  constructor(type, position , gameState) {
    this.gameState = gameState
    this.type = type;
    this.position = { x: position.x, y: position.y };
    this.id = Math.floor(Date.now() * Math.random()).toFixed();
  }

  // Apply powerup effect to player stats
  applyToPlayer(player) {
    switch (this.type) {
      case POWERUP_TYPES.SPEED:
        if (player.stats.speed < 10) { // Cap at 10
          player.stats.speed += 1;
        }
        break;
      case POWERUP_TYPES.RANGE:
        if (player.stats.range < 8) { // Cap at 8
          player.stats.range += 1;
        }
        break;
      case POWERUP_TYPES.BOMB:
        if (player.stats.bCount < 5) { // Cap at 5
          player.stats.bCount += 1;
        }
        break;
    }
  }

  // Static method to get a random powerup type
  static getRandomType() {
    const types = Object.values(POWERUP_TYPES);
    return types[Math.floor(Math.random() * types.length)];
  }
}

module.exports = { PowerUp, POWERUP_TYPES };
