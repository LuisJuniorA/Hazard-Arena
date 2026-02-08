export default class Enemy {
    constructor(x, y, player, config) {
        this.x = x;
        this.y = y;

        this.player = player; // ← OUI, C’EST NORMAL

        this.hp = config.hp;
        this.speed = config.speed;
        this.damage = 1;

        this.radius = config.radius ?? 8;
        this.color = config.color ?? 'black';

        this.behaviors = [];
        this.dead = false;
    }

    addBehavior(behavior) {
        behavior.entity = this;
        this.behaviors.push(behavior);
    }

    update(deltaTime) {
        for (const b of this.behaviors) {
            b.update(deltaTime);
        }
    }

    render(ctx, canvas) {
        const screenX = this.x - this.player.x + canvas.width / 2;
        const screenY = this.y - this.player.y + canvas.height / 2;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) this.dead = true;
    }
}
