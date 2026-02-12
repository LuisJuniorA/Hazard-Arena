import Projectile from "../player/Projectile.js";
import ExplodeOnHit from "../../behaviors/ExplodeOnHit.js";
import FireballParticles from "../../particles/FireballParticles.js";

export default class Fireball extends Projectile {
    constructor(x, y, vx, vy, level) {
        const explosion = new ExplodeOnHit(60, 0.3); // radius, duration

        super(
            x,
            y,
            vx,
            vy,
            level,
            250,
            10,
            "#ff7043",
            6,
            5,
            {
                once: true,
                onHit: (src, target) => {
                    explosion.explode(src);
                }
            }
        );

        this.particles = new FireballParticles(this.x, this.y);
        this.addBehavior(explosion);
        this.explosion = explosion;
    }

    update(dt) {
        super.update(dt);
        this.particles.x = this.x;
        this.particles.y = this.y;
        this.particles.update(dt, this.x, this.y);

        if (this.explosion.active) {
            this.explosion.update(dt);
        } else if (this.dead) {
            this.dead = true;
        }
    }

    render(ctx, canvas, player) {
        const camX = player.x - canvas.width / 2;
        const camY = player.y - canvas.height / 2;
        this.particles.render(ctx, camX, camY); // On passe la caméra aux particules 
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(this.x - camX, this.y - camY, this.radius / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}
