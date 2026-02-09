import Behavior from '../entities/base/Behavior.js';

export default class AvoidOtherEnemies extends Behavior {
    /**
     * @param {number} padding - distance minimale supplémentaire entre ennemis
     * @param {number} influence - distance max pour vérifier collision
     */
    constructor(padding = 1, influence = 50) {
        super();
        this.padding = padding;
        this.influence = influence;
    }

    update(dt) {
        const e = this.entity;
        const level = e?.level;
        if (!e || !level) return;

        const enemies = level.enemies;
        for (const other of enemies) {
            if (other === e) continue;

            const dx = other.x - e.x;
            const dy = other.y - e.y;

            if (Math.abs(dx) > this.influence || Math.abs(dy) > this.influence) continue;

            const dist = Math.hypot(dx, dy);
            const minDist = (e.radius ?? 0) + (other.radius ?? 0) + this.padding;

            if (dist > 0 && dist < minDist) {
                const overlap = minDist - dist;
                const pushX = (dx / dist) * (overlap / 2);
                const pushY = (dy / dist) * (overlap / 2);

                e.x -= pushX;
                e.y -= pushY;
            }
        }
    }
}
