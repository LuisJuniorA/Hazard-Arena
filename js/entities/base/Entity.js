export default class Entity {
    constructor(x, y, radius = 0) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dead = false;
        this.behaviors = [];
        this.level = null;
    }

    addBehavior(behavior) {
        behavior.onAttach(this, this.level);
        this.behaviors.push(behavior);
    }

    update(dt, level) {
        if (level) this.level = level;

        for (const b of this.behaviors) {
            b.update?.(dt, level);
        }
    }

    render(ctx, canvas, player = null) {}

    takeDamage(amount) {
        // peut être surchargé par des classes qui ont de la vie
    }
}
