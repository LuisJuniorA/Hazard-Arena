import ProjectileParticle from "../base/ProjectileParticle.js";

export default class FireSmoke extends ProjectileParticle {
    constructor(x, y) {
        super(x, y);
        this.opacity = 0.8;
        this.r = 0.6;
    }

    update(dt) {
        this.y -= Math.random() * 3;
        this.x += Math.random() * 4 - 2;
        this.opacity -= 0.015;
        if (this.opacity <= 0) this.destroyed = true;
    }

    render(ctx, camX, camY) {
        if (this.opacity <= 0) return;
        ctx.fillStyle = "rgba(60,60,60," + this.opacity + ")";
        ctx.beginPath();
        ctx.arc(this.x - camX, this.y - camY, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
}
