export default class AvoidOtherEnemies {
    /**
     * @param {number} padding - distance minimale supplémentaire entre ennemis
     * @param {number} influence - distance max pour vérifier collision
     */
    constructor(padding = 1, influence = 50) {
        this.padding = padding;
        this.influence = influence;
    }

    update(dt) {
        const e = this.entity;
        if (!e || !e.level) return;

        const enemies = e.level.enemies; // tous les ennemis du level
        for (const other of enemies) {
            if (other === e) continue;

            const dx = other.x - e.x;
            const dy = other.y - e.y;
            if (Math.abs(dx) > this.influence || Math.abs(dy) > this.influence) continue;

            const dist = Math.hypot(dx, dy);
            const minDist = e.radius + other.radius + this.padding;

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
