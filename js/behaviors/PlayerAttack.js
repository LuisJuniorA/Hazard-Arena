import Behavior from '../entities/base/Behavior.js';
import Projectile from '../entities/player/Projectile.js';
import EntityManager from '../utils/EntityManager.js';
import soundManager from '../common/soundInstance.js';

export default class PlayerAttack extends Behavior {

    constructor(burstInterval = 0.1) {
        super();

        this.burstCount = 0;
        this.burstInterval = burstInterval;

        this.cooldown = 0;
        this.currentBurst = 0;
        this.burstTimer = 0;
    }

    update(dt) {
        const player = this.entity;
        const level = this.level;

        if (!player || !level) return;

        this.burstCount = player.burstCount;

        this.cooldown -= dt;
        if (this.cooldown > 0) return;

        this.burstTimer -= dt;

        if (this.burstTimer <= 0 && this.currentBurst < this.burstCount) {

            const target = EntityManager.getClosestEnemy(player, level.enemies);
            if (target) this.shoot(player, target, level);

            this.currentBurst++;
            this.burstTimer = this.burstInterval;
        }

        if (this.currentBurst >= this.burstCount) {
            this.currentBurst = 0;
            this.cooldown = 1 / player.attackSpeed;
        }
    }


    shoot(player, target, level) {
        const vector = EntityManager.getEnemyVector(player, target);
        if (!vector) return;
        const { vx, vy } = vector;
        if (!vx || !vy) return;

        const projectile = new Projectile(
            player.x,
            player.y,
            vx,
            vy,
            level,
            300,
            player.attackDamage * (player.piercingDamageMultiplier ?? 1),
            '#4FC3F7',
            4,
            5,
            {
                piercing: player.piercing ?? 0,
                infinitePiercing: player.infinitePiercing ?? false,
                execute: player.piercingExecute ?? false
            }
        );

        level.addProjectile(projectile);
        soundManager.shoot();
    }
}
