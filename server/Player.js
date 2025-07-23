const Bomb = require("./Bomb.js")
class Player {
  constructor(name, map, position, id) {
    this.name = name
    this.id = id
    this.position = position
    this.stats = { speed: 5, range: 2, bCount: 1 }
    this.lives = 3
    this.map = map
  }
  layBomb() {
    return new Bomb(this.id, this.position, this.stats.range)
  }

  checkPowerUpCollection(x, y) {
    
    const powerUp = this.map.getPowerUpAt(x, y);
    if (powerUp) {
      powerUp.applyToPlayer(this);
      this.map.removePowerUp(x, y);
    }
  }


  move(dir, activeBombs) {

    console.log(activeBombs, "bbmmmmmmb");

    switch (dir) {
      case "Up":
        // console.log("fllll" , this.map.grid ,this.map.grid.flat() ,  this.map.grid.flat()[this.position.y-1] );

        // this.map.grid[this.position.y-1][this.position.x] == "EMPTY" && (this.position.y -= 1.5)
        console.log(this.map.grid.flat())
        console.log("POOOOS", this.map.grid[this.position.y - 1][this.position.x], this.position.y - 1, this.position.x);

        if ((this.position.y - 1 >= 1 && this.position.y <= this.map.grid.length - 1) &&
          this.map.grid[this.position.y - 1][this.position.x] == "BLOCK" && activeBombs.every(bm => bm.x != this.position.x || bm.y != this.position.y - 1)) {
          this.checkPowerUpCollection(this.position.x, this.position.y - 1)
          this.position.y -= 1

        }

        break
      case "Down":
        if ((this.position.y + 1 >= 1 && this.position.y <= this.map.grid.length - 1) &&
          this.map.grid[this.position.y + 1][this.position.x] == "BLOCK" && activeBombs.every(bm => bm.x != this.position.x || bm.y != this.position.y + 1)) {
          this.checkPowerUpCollection(this.position.x, this.position.y + 1)
          this.position.y += 1
        }
        break

      case "Left":
        if ((this.position.x - 1 >= 1 && this.position.x <= this.map.grid.length - 1) &&
          this.map.grid[this.position.y][this.position.x - 1] == "BLOCK"
          && activeBombs.every(bm => bm.x != this.position.x - 1 || bm.y != this.position.y)){
          this.checkPowerUpCollection(this.position.x-1, this.position.y )
            this.position.x -= 1
          }
        break


      case "Right":

        console.log("aaaaaa", activeBombs.every(bm => bm.x != this.position.x + 1 || bm.y != this.position.y
        ));

        if ((this.position.x + 1 >= 1 && this.position.x <= this.map.grid.length - 1) &&
          this.map.grid[this.position.y][this.position.x + 1] == "BLOCK"
          && activeBombs.every(bm => (bm.x != this.position.x + 1) || (bm.y != this.position.y)
          )){
          this.checkPowerUpCollection(this.position.x+1, this.position.y )

            this.position.x += 1
          }

        break;
    }
  }

}

module.exports = Player