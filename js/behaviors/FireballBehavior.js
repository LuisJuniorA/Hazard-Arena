import Behavior from '../entities/base/Behavior.js';
import Fireball from '../entities/spells/Fireball.js';
import EntityManager from '../utils/EntityManager.js';

export default class FireballBehavior extends Behavior {
    /**
     * @param {number} baseDamage
     * @param {number} radius - rayon de la boule de feu
     */
    constructor(baseDamage = 5, radius = 8) {
        super();
        this.baseDamage = baseDamage;
        this.radius = radius;
        this.timer = 0;
    }

    update(dt) {
        const player = this.entity;
        if (!player || !this.level) return;

        // cooldown basé sur player.attackSpeed
        this.timer += dt;
        const interval = 1 / (player.attackSpeed || 1); // sec par attaque
        if (this.timer < interval) return;
        this.timer = 0;
        if (!this.level.enemies.length) return;
        const target = EntityManager.getClosestEnemy(player, this.level.enemies);
        const { vx, vy } = EntityManager.getEnemyVector(player, target);
        if (!vx || !vy) return;

        // crée le projectile
        const fireball = new Fireball(
            player.x,
            player.y,
            vx,
            vy,
            this.level
        );

        player.level.addProjectile(fireball);
    }
}
