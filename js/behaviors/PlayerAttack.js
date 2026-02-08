import Projectile from '../class/Projectile.js';

export default class PlayerAttack {
    static enemies;

    /**
     * @param {number} burstCount - nombre de projectiles par rafale
     * @param {number} burstInterval - délai entre chaque projectile (s)
     */
    constructor(burstCount = 3, burstInterval = 0.1) {
        this.cooldown = 1;           // cooldown global entre rafales
        this.burstCount = burstCount; 
        this.burstInterval = burstInterval;

        this.currentBurst = 0;
        this.burstTimer = 0;
    }

    update(dt) {
        const player = this.entity;
        if (!player) return;

        // cooldown global avant la prochaine rafale
        this.cooldown -= dt;

        if (this.cooldown <= 0) {
            // timer interne pour tirer les projectiles de la rafale
            this.burstTimer -= dt;

            if (this.burstTimer <= 0 && this.currentBurst < this.burstCount) {
                const target = this.getClosestEnemy(player);
                if (target) this.shoot(player, target);

                this.currentBurst++;
                this.burstTimer = this.burstInterval;
            }

            // rafale terminée = reset
            if (this.currentBurst >= this.burstCount) {
                this.currentBurst = 0;
                this.cooldown = player.attackSpeed;
            }
        }
    }

    getClosestEnemy(player) {
        let closest = null;
        let closestDist = Infinity;
        for (const e of PlayerAttack.enemies) {
            if (e.dead) continue;
            const dx = e.x - player.x;
            const dy = e.y - player.y;
            const dist = Math.hypot(dx, dy);
            if (dist < closestDist) {
                closestDist = dist;
                closest = e;
            }
        }
        return closest;
    }

    shoot(player, target) {
        const dx = target.x - player.x;
        const dy = target.y - player.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const vx = dx / dist;
        const vy = dy / dist;
        const proj = new Projectile(player.x, player.y, vx, vy, PlayerAttack.enemies, 300, player.attackDamage);
        if (!Projectile.projectiles) Projectile.projectiles = [];
        Projectile.projectiles.push(proj);
    }
}
