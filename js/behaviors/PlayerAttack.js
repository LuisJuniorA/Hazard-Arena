import Behavior from '../entities/base/Behavior.js';
import Projectile from '../entities/player/Projectile.js';

export default class PlayerAttack extends Behavior {
    /**
     * @param {number} burstCount - projectiles par rafale
     * @param {number} burstInterval - délai entre projectiles (s)
     */
    constructor(burstCount = 3, burstInterval = 0.1) {
        super();

        this.burstCount = burstCount;
        this.burstInterval = burstInterval;

        this.cooldown = 0;
        this.currentBurst = 0;
        this.burstTimer = 0;
    }

    update(dt) {
        const player = this.entity;
        const level = this.level;
        if (!player || !level) return;

        this.cooldown -= dt;

        if (this.cooldown > 0) return;

        this.burstTimer -= dt;

        if (this.burstTimer <= 0 && this.currentBurst < this.burstCount) {
            const target = this.getClosestEnemy(player, level);
            if (target) this.shoot(player, target, level);

            this.currentBurst++;
            this.burstTimer = this.burstInterval;
        }

        if (this.currentBurst >= this.burstCount) {
            this.currentBurst = 0;
            this.cooldown = player.attackSpeed;
        }
    }

    getClosestEnemy(player, level) {
        let closest = null;
        let closestDist = Infinity;

        for (const e of level.enemies) {
            if (e.dead) continue;

            const dx = e.x - player.x;
            const dy = e.y - player.y;
            const dist = dx * dx + dy * dy;

            if (dist < closestDist) {
                closestDist = dist;
                closest = e;
            }
        }

        return closest;
    }

    shoot(player, target, level) {
        const dx = target.x - player.x;
        const dy = target.y - player.y;
        const dist = Math.hypot(dx, dy) || 0.001;

        const vx = dx / dist;
        const vy = dy / dist;

        const projectile = new Projectile(
            player.x,
            player.y,
            vx,
            vy,
            level,
            300,
            player.attackDamage
        );

        level.addProjectile(projectile);
    }
}
