import Particle from "./Particle.js";

export default class ProjectileParticle extends Particle {
    constructor(x, y) {
        super(x, y);
        this.opacity = 1;
        this.life = 30; // valeur par défaut
    }

    update(dt) {
        this.life--;
        if (this.life <= 0 || this.opacity <= 0) this.destroyed = true;
    }

    render(ctx, camX, camY) {
        // Par défaut, rien : c'est aux sous-classes de dessiner
    }
}
