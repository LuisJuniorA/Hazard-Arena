import Behavior from '../entities/base/Behavior.js';

export default class ExplodeOnHit extends Behavior { //ca reste un behavior, mais il est réactif. Pas continu. (donc pas de update, juste callback)

    constructor(radius = 60, damage = 10) {
        super();
        this.radius = radius;
        this.damage = damage;
    }

    explode(src) {
        if (!src.level) return;

        for (const enemy of src.level.enemies) {
            if (enemy.dead) continue;

            const dx = enemy.x - src.x;
            const dy = enemy.y - src.y;
            const dist = Math.hypot(dx, dy);

            if (dist <= this.radius) {
                enemy.takeDamage(this.damage);
            }
        }
    }
}
