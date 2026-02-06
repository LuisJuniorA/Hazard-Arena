export default class ContactDamage {
    constructor(cooldown = 0.5) {
        this.cooldown = cooldown;
        this.timer = 0;
    }

    update(dt) {
        this.timer -= dt;
        if (this.timer > 0) return;

        const e = this.enemy;
        const p = e.player;

        const dist = Math.hypot(e.x - p.x, e.y - p.y);
        if (dist < e.radius + 10) {
            p.takeDamage(e.damage);
            this.timer = this.cooldown;
        }
    }
}
