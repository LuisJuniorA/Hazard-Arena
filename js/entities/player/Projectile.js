import Entity from '../base/Entity.js';
import DealDamage from '../../behaviors/DealDamage.js';

export default class Projectile extends Entity {
    constructor(
        x,
        y,
        vx,
        vy,
        level,
        speed = 200,
        damage = 1,
        color = '#4FC3F7',
        radius = 4,
        ttl = 5,
        damageOptions = {}
    ) {
        super(x, y, radius);

        this.vx = vx;
        this.vy = vy;
        this.speed = speed;
        this.damage = damage;
        this.color = color;
        this.ttl = ttl;
        this.level = level;

        if (level) {
            this.addBehavior(
                new DealDamage(damage, {
                    once: false,
                    ...damageOptions
                })
            );
        }
    }

    update(dt) {
        this.x += this.vx * this.speed * dt;
        this.y += this.vy * this.speed * dt;

        super.update(dt, this.level);

        this.ttl -= dt;
        if (this.ttl <= 0) this.dead = true;
    }

    render(ctx, canvas, player) {
        ctx.save();

        const screenX = this.x - player.x + canvas.width / 2;
        const screenY = this.y - player.y + canvas.height / 2;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
