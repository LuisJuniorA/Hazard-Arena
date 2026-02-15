export default class PauseScreen {

    constructor() {
        this.active = false;
        this.buttons = [];
        this.viewRenderer = null;
        this.level = null;

        this.fadeAlpha = 0;
        this.targetAlpha = 0.65;
    }

    open({ viewRenderer, level }) {
        this.active = true;
        this.viewRenderer = viewRenderer;
        this.level = level;
        this.fadeAlpha = 0;
        this.buttons = [];

        if (this.level?.timer) this.level.timer.pause();
    }

    close() {
        this.active = false;
        this.buttons = [];

        if (this.level?.timer) this.level.timer.start();
    }

    toggle({ viewRenderer, level }) {
        if (this.active) {
            this.close();
        } else {
            this.open({ viewRenderer, level });
        }
    }

    update(dt) {
        if (!this.active) return;

        if (this.fadeAlpha < this.targetAlpha) {
            this.fadeAlpha = Math.min(this.fadeAlpha + dt * 2.5, this.targetAlpha);
        }
    }

    render(ctx, canvas) {
        if (!this.active) return;
        const { width, height } = canvas;

        ctx.save();

        // ===== Overlay sombre =====
        ctx.fillStyle = `rgba(0, 0, 0, ${this.fadeAlpha})`;
        ctx.fillRect(0, 0, width, height);

        // ===== Panneau central =====
        const panelW = Math.min(460, width * 0.75);
        const panelH = 300;
        const panelX = (width - panelW) / 2;
        const panelY = (height - panelH) / 2;

        // Fond panneau
        ctx.fillStyle = 'rgba(20, 20, 40, 0.95)';
        ctx.strokeStyle = 'rgba(100, 160, 255, 0.6)';
        ctx.lineWidth = 3;
        this.roundRect(ctx, panelX, panelY, panelW, panelH, 16);
        ctx.fill();
        ctx.stroke();

        // ===== Titre =====
        ctx.fillStyle = '#7cb3ff';
        ctx.font = 'bold 38px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Pause Menu', width / 2, panelY + 50);

        // ===== Ligne séparatrice =====
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(panelX + 30, panelY + 80);
        ctx.lineTo(panelX + panelW - 30, panelY + 80);
        ctx.stroke();

        // ===== Boutons =====
        const btnW = 180;
        const btnH = 45;
        const btnSpacing = 16;
        const totalBtnH = 3 * btnH + 2 * btnSpacing;
        const btnStartY = panelY + 80 + (panelH - 80 - totalBtnH) / 2;

        this.buttons = [];

        const labels = ['Resume', 'Retry', 'Main Menu'];
        const actions = ['resume', 'retry', 'menu'];

        for (let i = 0; i < 3; i++) {
            this.buttons.push({
                label: labels[i],
                x: (width - btnW) / 2,
                y: btnStartY + i * (btnH + btnSpacing),
                w: btnW,
                h: btnH,
                action: actions[i],
                isHovered: false
            });
        }

        for (const btn of this.buttons) {
            this.renderButton(ctx, btn);
        }

        ctx.restore();
    }

    renderButton(ctx, btn) {
        const { x, y, w, h, label, isHovered } = btn;

        ctx.fillStyle = isHovered ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        this.roundRect(ctx, x, y, w, h, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x + w / 2, y + h / 2);
    }

    // ===== Interactions souris =====
    handleMouseMove(mx, my) {
        if (!this.active) return;
        for (const btn of this.buttons) {
            btn.isHovered = mx >= btn.x && mx <= btn.x + btn.w &&
                            my >= btn.y && my <= btn.y + btn.h;
        }
    }

    handleClick(mx, my) {
        if (!this.active || !this.viewRenderer) return;

        for (const btn of this.buttons) {
            if (mx >= btn.x && mx <= btn.x + btn.w &&
                my >= btn.y && my <= btn.y + btn.h) {

                if (btn.action === 'resume') {
                    this.close();
                } else if (btn.action === 'retry') {
                    const mapName = this.viewRenderer.currentView;
                    this.close();
                    this.viewRenderer.loadMap(mapName);
                } else if (btn.action === 'menu') {
                    this.close();
                    this.viewRenderer.loadMenu();
                }
                return;
            }
        }
    }

    // ===== Utils =====
    roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }
}
