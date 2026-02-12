import Behavior from '../entities/base/Behavior.js';

export default class DealDamage extends Behavior {
    /**
     * @param {number} amount
     * @param {Object} options
     * @param {boolean} options.once - meurt au premier hit (projectile classique)
     * @param {number} options.interval - intervalle pour DOT (0 = instant)
     * @param {Function|null} options.filter - (source, target) => boolean
     * @param {Function|null} options.onHit - callback après hit
     * @param {number} options.piercing - nombre d'ennemis traversables
     * @param {boolean} options.infinitePiercing - traverse infini
     * @param {boolean} options.execute - tue les ennemis touchés
     */
    constructor(amount, options = {}) {
        super();

        this.amount = amount;

        this.once = options.once ?? true;
        this.interval = options.interval ?? 0;
        this.filter = options.filter ?? null;
        this.onHit = options.onHit ?? null;

        this.piercing = options.piercing ?? 0;
        this.infinitePiercing = options.infinitePiercing ?? false;
        this.execute = options.execute ?? false;

        this.timer = 0;
        this.hitTargets = new Set(); // évite multi-hit sur même cible
    }

    update(dt) {
        const src = this.entity;
        if (!src || src.dead) return;
        if (!src.level) return;

        this.timer += dt;
        if (this.interval > 0 && this.timer < this.interval) return;
        this.timer = 0;

        for (const target of src.level.enemies) {
            if (target.dead) continue;

            if (this.filter && !this.filter(src, target)) continue;
            if (this.hitTargets.has(target)) continue;

            if (this.overlap(src, target)) {

                // Applique les dégâts
                target.takeDamage(this.amount);
                this.hitTargets.add(target);

                // Execute (fusion)
                if (this.execute && target.hp > 0) {
                    target.takeDamage(target.hp);
                }

                // Callback custom
                if (this.onHit) {
                    this.onHit(src, target);
                }

                // Gestion piercing
                if (!this.infinitePiercing) {
                    this.piercing--;

                    if (this.once || this.piercing < 0) {
                        src.dead = true;
                        return;
                    }
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
