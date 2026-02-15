import ProjectileParticle from "../base/ProjectileParticle.js";

export default class FireTrail extends ProjectileParticle {
    constructor(x, y) {
        super(x, y);
        this.r = 4 + Math.random() * 2;
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = -2 - Math.random() * 3;
        this.life = 20 + Math.random() * 10;
    }

    update(dt) {
        super.update(dt);
        this.x += this.vx;
        this.y += this.vy;
        this.opacity -= 0.05;
    }

    render(ctx, camX, camY) {
        if (this.opacity <= 0) return;
        const drawX = this.x - camX;
        const drawY = this.y - camY;

        ctx.save();
        const gradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, this.r);
        gradient.addColorStop(0, `rgba(255,255,0,${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(255,165,0,${this.opacity * 0.7})`);
        gradient.addColorStop(1, `rgba(255,0,0,0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(drawX, drawY, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
