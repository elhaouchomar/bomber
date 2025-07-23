class Bomb{
    constructor(ownerId , position , range){
        this.position = JSON.parse(JSON.stringify(position))
        this.ownerId = ownerId
        this.range = range
        this.timer = 2000
        this.Explostion()
        
    }

    Explostion(){
        setTimeout(()=>{console.log("exploded");
        } , this.timer)
    }
}

module.exports = Bomb
