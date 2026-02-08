import Projectile from '../class/Projectile.js';

export default class PlayerAttack {
    /**
     * @param {number} burstCount - nombre de projectiles par rafale
     * @param {number} burstInterval - délai entre chaque projectile (s)
     */
    constructor(burstCount = 3, burstInterval = 0.1) {
        this.cooldown = 1;           
        this.burstCount = burstCount; 
        this.burstInterval = burstInterval;

        this.currentBurst = 0;
        this.burstTimer = 0;
    }

    update(dt, level) {
        const player = this.entity; 
        if (!player || !level) return;
        // cooldown global avant la prochaine rafale
        this.cooldown -= dt;

        if (this.cooldown <= 0) {
            // timer interne pour tirer les projectiles de la rafale
            this.burstTimer -= dt;

            if (this.burstTimer <= 0 && this.currentBurst < this.burstCount) {
                const target = this.getClosestEnemy(player, level);
                if (target) this.shoot(player, target, level);

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

    getClosestEnemy(player, level) {
        const enemies = level.enemies; // récupère les ennemis depuis la level
        let closest = null;
        let closestDist = Infinity;
        for (const e of enemies) {
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

    shoot(player, target, level) {
        const dx = target.x - player.x;
        const dy = target.y - player.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const vx = dx / dist;
        const vy = dy / dist;

        // crée le projectile
        const proj = new Projectile(player.x, player.y, vx, vy, level, 300, player.attackDamage);

        // ajoute le comportement de dégâts avec la level
        level.addProjectile(proj); // ajoute le projectile à la level
    }
}
