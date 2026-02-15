import Behavior from '../entities/base/Behavior.js';

export default class AuraDamage extends Behavior {
    /**
     * @param {number} radius
     * @param {number} damagePerSecond
     * @param {number} interval
     */
    constructor(radius = 80, damagePerSecond = 4, interval = 0.4) {
        super();
        this.radius = radius;
        this.damagePerSecond = damagePerSecond;
        this.interval = interval;
        this.timer = 0;
    }

    update(dt) {
        const player = this.entity;
        const level = this.level;
        if (!player || !level) return;

        this.timer += dt;
        if (this.timer < this.interval) return;

        const ticks = Math.floor(this.timer / this.interval);
        this.timer -= ticks * this.interval;

        const damage = this.damagePerSecond * this.interval * ticks;
        if (damage <= 0) return;

        for (const enemy of level.enemies) {
            if (enemy.dead) continue;

            const dx = enemy.x - player.x;
            const dy = enemy.y - player.y;
            const dist = Math.hypot(dx, dy);

            if (dist <= this.radius + (enemy.radius ?? 0)) {
                enemy.takeDamage(damage);
            }
        }
    }
}
