import XP from "./XP.js";

export default class Enemy {
    constructor(x, y, level, config = {}) {
        this.x = x;
        this.y = y;

        this.level = level; // référence au level courant
        this.hp = config.hp ?? 10;
        this.speed = config.speed ?? 50;
        this.damage = config.damage ?? 1;

        this.radius = config.radius ?? 8;
        this.color = config.color ?? 'black';
        this.xpAmount = config.xpAmount ?? 1;

        this.behaviors = [];
        this.dead = false;
    }

    addBehavior(behavior) {
        behavior.entity = this;
        this.behaviors.push(behavior);
    }

    update(dt) {
        for (const b of this.behaviors) {
            b.update(dt, this.level);
        }
    }

    render(ctx, canvas) {
        if (!this.level || !this.level.player) return;
        const player = this.level.player;
        const screenX = this.x - player.x + canvas.width / 2;
        const screenY = this.y - player.y + canvas.height / 2;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.dead = true;

            // Drop XP automatiquement sur la mort
            if (this.level) {
                const xp = new XP(this.x, this.y, this.xpAmount);
                this.level.addXP(xp);
            }
        }
    }
}
