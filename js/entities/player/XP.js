import Entity from '../base/Entity.js';

export default class XP extends Entity {
    constructor(x, y, level, amount = 1) {
        super(x, y, 3);
        this.amount = amount;
        this.color = '#FFD700';
        this.level = level
    }

    update(dt) {
        if (!this.level || !this.level.player) return;
        const player = this.level.player;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < player.experienceGrabRange) {
            player.grabXp(this.amount);
            this.dead = true;
        }

        for (const b of this.behaviors) b.update?.(dt, this.level);
    }

    render(ctx, canvas, player) {
        ctx.save();
        if (!player) return;

        const screenX = this.x - player.x + canvas.width / 2;
        const screenY = this.y - player.y + canvas.height / 2;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
