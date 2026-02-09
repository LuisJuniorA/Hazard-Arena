import Behavior from '../entities/base/Behavior.js';

export default class ContactDamage extends Behavior {
    /**
     * @param {number} amount - dégâts infligés au joueur
     * @param {number} cooldown - délai minimum entre chaque hit
     */
    constructor(amount, cooldown = 0.5) {
        super(); 
        this.amount = amount;
        this.cooldown = cooldown;
        this.timer = 0;
    }

    update(dt) {
        const e = this.entity;
        const p = e?.level?.player;
        if (!e || !p) return;

        this.timer -= dt;
        if (this.timer > 0) return;

        const dx = p.x - e.x;
        const dy = p.y - e.y;
        const dist = Math.hypot(dx, dy);

        if (dist < (e.radius ?? 0) + (p.radius ?? 0)) {
            p.takeDamage(this.amount);
            this.timer = this.cooldown;
        }
    }
}
