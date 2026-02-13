import ProjectileParticle from "../base/ProjectileParticle.js";

export default class FireSmoke extends ProjectileParticle {
    constructor(x, y) {
        super(x, y);
        this.opacity = 1.0;   // plus visible dès le départ
        this.r = 1.5;         // plus gros
    }

    update(dt) {
        this.y -= Math.random() * 2;
        this.x += Math.random() * 4 - 2;
        this.opacity -= 0.03;
        if (this.opacity <= 0) this.destroyed = true;
    }

    render(ctx, camX, camY) {
        if (this.opacity <= 0) return;
        ctx.fillStyle = `rgba(60,60,60,${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x - camX, this.y - camY, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
}
