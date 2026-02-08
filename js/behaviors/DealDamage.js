export default class DealDamage {
    /**
     * @param {Array} targets - tableau des ennemis
     * @param {number} amount - dégâts à infliger
     * @param {Object} source - l'objet infligeant les dégâts (ex: projectile) {x, y, radius, dead}
     * @param {Function} condition - optionnel, fonction (source, target) => boolean
     */
    constructor(targets, amount, source, condition = null) {
        this.targets = targets;
        this.amount = amount;
        this.source = source; // le projectile
        this.condition = condition;
    }

    update() {
        const src = this.source;
        if (!src || src.dead) return;

        for (const t of this.targets) {
            if (t.dead) continue;
            if (this.condition && !this.condition(src, t)) continue;

            const dx = t.x - src.x;
            const dy = t.y - src.y;
            const dist = Math.hypot(dx, dy);

            const minDist = (src.radius ?? 4) + (t.radius ?? 8);

            if (dist < minDist) {
                t.takeDamage(this.amount);
                src.dead = true; // le projectile disparaît
                break; // stop après la première cible touchée
            }
        }
    }
}
