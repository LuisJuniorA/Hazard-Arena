export default class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.destroyed = false;
    }

    update(dt) {}
    render(ctx) {}
}