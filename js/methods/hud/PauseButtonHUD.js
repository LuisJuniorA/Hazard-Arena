export default class PauseButtonHUD {

    constructor(level) {
        this.level = level;
        this.size = 36;
        this.x = 0;
        this.y = 0;
        this.isHovered = false;
    }

    update(dt) {
        // rien pour l'instant
    }

    render(ctx, canvas) {
        if (this.level.endScreen.active || this.level.pauseScreen.active || this.level.upgradeFacade?.active) return;

        const size = this.size;
        const margin = 16;
        const x = canvas.width - size - margin;
        const y = margin;

        // Stocker la hitbox
        this.x = x;
        this.y = y;

        ctx.save();

        // Fond cercle
        const cx = x + size / 2;
        const cy = y + size / 2;
        const r = size / 2;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = this.isHovered ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.4)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Icône pause (deux barres)
        const barW = 4;
        const barH = size * 0.4;
        const gap = 5;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - gap - barW / 2, cy - barH / 2, barW, barH);
        ctx.fillRect(cx + gap - barW / 2, cy - barH / 2, barW, barH);

        ctx.restore();
    }

    handleClick(mx, my) {
        if (this.level.endScreen.active || this.level.pauseScreen.active || this.level.upgradeFacade?.active) return false;

        const cx = this.x + this.size / 2;
        const cy = this.y + this.size / 2;

        if (Math.hypot(mx - cx, my - cy) <= this.size / 2) {
            this.level.pauseScreen.toggle({
                viewRenderer: this.level._viewRenderer,
                level: this.level
            });
            return true;
        }
        return false;
    }

    handleMouseMove(mx, my) {
        if (this.level.endScreen.active || this.level.pauseScreen.active || this.level.upgradeFacade?.active) {
            this.isHovered = false;
            return;
        }

        const cx = this.x + this.size / 2;
        const cy = this.y + this.size / 2;
        this.isHovered = Math.hypot(mx - cx, my - cy) <= this.size / 2;
    }
}
