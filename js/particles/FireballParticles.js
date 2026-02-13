import FireTrail from "./trail/FireTrail.js";
import FireSmoke from "./smoke/FireSmoke.js";

export default class FireballParticles {
    constructor() {
        this.particles = [];
    }

    addTrail(x, y) {
        for (let i = 0; i < 8; i++) {
            this.particles.push(new FireTrail(x, y));
            this.particles.push(new FireSmoke(x, y));
        }
    }

    update(dt, projectileX, projectileY) {
        // On génère les nouvelles particules **au niveau du projectile actuel**
        this.addTrail(projectileX, projectileY);

        for (const p of this.particles) {
            if (p instanceof FireTrail) p.update(dt, (trail) => this.particles.push(trail));
            else p.update(dt);
        }

        this.particles = this.particles.filter(p => !p.destroyed);
    }

    render(ctx, camX, camY) {
        for (const p of this.particles) {
            p.render(ctx, camX, camY); // On relaie les coordonnées de caméra 
        }
    }
}
