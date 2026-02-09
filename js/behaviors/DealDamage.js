import Behavior from '../entities/base/Behavior.js';

export default class DealDamage extends Behavior {
    /**
     * @param {number} amount
     * @param {Object} options
     */
    constructor(amount, options = {}) {
        super();

        this.amount = amount;

        this.once = options.once ?? true;       // projectile
        this.interval = options.interval ?? 0;  // DOT
        this.filter = options.filter ?? null;   // (source, target) => boolean
        this.onHit = options.onHit ?? null;     // callback

        this.timer = 0;
        this.hitTargets = new Set(); // evite multi-hit non voulu
    }

    update(dt) {
        const src = this.entity;
        if (!src || src.dead) return;

        this.timer += dt;
        if (this.interval > 0 && this.timer < this.interval) return;
        this.timer = 0;

        for (const target of src.level.enemies) {
            if (target.dead) continue;

            if (this.filter && !this.filter(src, target)) continue;
            if (this.once && this.hitTargets.has(target)) continue;

            if (this.overlap(src, target)) {
                target.takeDamage(this.amount);
                this.hitTargets.add(target);

                if (this.onHit) this.onHit(src, target);

                if (this.once) {
                    src.dead = true;
                    return;
                }
            }
        }
    }

    overlap(a, b) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
        return dist < (a.radius ?? 0) + (b.radius ?? 0);
    }
}
