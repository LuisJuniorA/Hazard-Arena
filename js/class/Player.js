export default class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 5;
    }

    move(dx, dy) {
        this.x += dx * this.speed;
        this.y += dy * this.speed;
    }   
}