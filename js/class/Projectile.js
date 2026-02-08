import DealDamage from "../behaviors/DealDamage.js";

export default class Projectile {
    constructor(x, y, vx, vy, level, speed = 200, damage = 1, color = '#4FC3F7', radius = 4, ttl = 5) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.speed = speed;
        this.damage = damage;
        this.color = color;
        this.radius = radius;

        this.dead = false;
        this.behaviors = [];
        this.level = level; // référence à la map / level
        this.ttl = ttl; // durée de vie en secondes

        // ajoute automatiquement le comportement de dégâts contre tous les ennemis
        if (level) {
            this.addBehavior(new DealDamage(level.enemies, this.damage, this));
        }
    }

    addBehavior(behavior) {
        behavior.entity = this;
        this.behaviors.push(behavior);
    }

    update(dt) {
        this.x += this.vx * this.speed * dt;
        this.y += this.vy * this.speed * dt;

        for (const b of this.behaviors) {
            b.update(dt, this.level);
        }

        // réduire le TTL
        this.ttl -= dt;
        if (this.ttl <= 0) this.dead = true;
    }

    render(ctx, canvas, player) {
        const screenX = this.x - player.x + canvas.width / 2;
        const screenY = this.y - player.y + canvas.height / 2;

        const angle = Math.atan2(this.vy, this.vx);

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(angle);

        ctx.fillStyle = this.color;
        ctx.fillRect(-6, -2, 12, 4);

        ctx.restore();
    }
}
