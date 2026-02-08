import DealDamage from "../behaviors/DealDamage.js";

export default class Projectile {
    static projectiles;
    constructor(x, y, vx, vy, target, speed = 200, damage = 1, color = '#4FC3F7', radius = 4) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.speed = speed;
        this.damage = damage;
        this.color = color;
        this.radius = radius;

        this.dead = false;
        this.behaviors = []
        this.addBehavior(new DealDamage(target, this.damage, this));
    }

    addBehavior(behavior) {
        behavior.enemy = this;
        this.behaviors.push(behavior);
    }

    update(dt) {
        this.x += this.vx * this.speed * dt;
        this.y += this.vy * this.speed * dt;
        for (const b of this.behaviors) b.update(dt);
    }

    render(ctx, canvas, player) {
        const screenX = this.x - player.x + canvas.width / 2;
        const screenY = this.y - player.y + canvas.height / 2;

        // angle du projectile
        const angle = Math.atan2(this.vy, this.vx);

        ctx.save(); // sauvegarde état du canvas
        ctx.translate(screenX, screenY); // centre sur le projectile
        ctx.rotate(angle); // rotation selon le vecteur de déplacement

        ctx.fillStyle = this.color;
        const width = 12;  // longueur du projectile
        const height = 4;  // épaisseur

        // on dessine un rectangle centré
        ctx.fillRect(-width / 2, -height / 2, width, height);

        ctx.restore(); // restore pour ne pas affecter le reste du canvas
    }

}
