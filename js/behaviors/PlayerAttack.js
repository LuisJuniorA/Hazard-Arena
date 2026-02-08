import Projectile from '../class/Projectile.js';

export default class PlayerAttack {
    static enemies
    constructor() {
        this.cooldown = 0; // temps avant prochain tir
    }

    update(dt) {
        const player = this.entity;
        if (!player) return;

        this.cooldown -= dt;
        if (this.cooldown > 0) return;

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

        if (!closest) return;

        const dx = closest.x - player.x;
        const dy = closest.y - player.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const vx = dx / dist;
        const vy = dy / dist;

        const proj = new Projectile(player.x, player.y, vx, vy, 300, player.attackDamage);
        Projectile.projectiles.push(proj);

        this.cooldown = player.attackSpeed;
    }
}
