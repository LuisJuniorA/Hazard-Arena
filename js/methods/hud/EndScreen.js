export default class EndScreen {

    constructor() {
        this.active = false;
        this.victory = false;

        this.playerLevel = 0;
        this.timeElapsed = '0:00';

        this.buttons = []; // { label, x, y, w, h, action, isHovered }
        this.viewRenderer = null;

        this.fadeAlpha = 0;
        this.targetAlpha = 0.75;
    }

    open({ victory, playerLevel, timeElapsed, viewRenderer }) {
        this.active = true;
        this.victory = victory;
        this.playerLevel = playerLevel;
        let tmp = timeElapsed.split(':');
        this.timeElapsed = `${parseInt(tmp[0])} min ${tmp[1].padStart(2, '0')} sec`;
        this.viewRenderer = viewRenderer;
        this.fadeAlpha = 0;
        this.buttons = [];
    }

    close() {
        this.active = false;
        this.buttons = [];
    }

    update(dt) {
        if (!this.active) return;

        if (this.fadeAlpha < this.targetAlpha) {
            this.fadeAlpha = Math.min(this.fadeAlpha + dt * 1.5, this.targetAlpha);
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
        const panelW = Math.min(500, width * 0.8);
        const panelH = 340;
        const panelX = (width - panelW) / 2;
        const panelY = (height - panelH) / 2;

        // Fond panneau
        ctx.fillStyle = 'rgba(20, 20, 40, 0.95)';
        ctx.strokeStyle = this.victory ? 'rgba(0, 220, 100, 0.8)' : 'rgba(255, 60, 60, 0.8)';
        ctx.lineWidth = 3;
        this.roundRect(ctx, panelX, panelY, panelW, panelH, 16);
        ctx.fill();
        ctx.stroke();

        // ===== Titre =====
        const title = this.victory ? 'Level Complete' : 'Too Bad';
        const titleColor = this.victory ? '#00dc64' : '#ff3c3c';

        ctx.fillStyle = titleColor;
        ctx.font = 'bold 42px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, width / 2, panelY + 55);

        // ===== Ligne séparatrice =====
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(panelX + 30, panelY + 90);
        ctx.lineTo(panelX + panelW - 30, panelY + 90);
        ctx.stroke();

        // ===== Stats =====
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';

        ctx.fillText(`Player LVL : ${this.playerLevel}`, width / 2, panelY + 130);
        ctx.fillText(`Time : ${this.timeElapsed}`, width / 2, panelY + 165);

        // ===== Boutons =====
        const btnW = 180;
        const btnH = 50;
        const btnY = panelY + panelH - 80;
        const btnSpacing = 20;

        this.buttons = [];

        if (!this.victory) {
            // Défaite → 2 boutons : Retry + Main Menu
            const totalW = btnW * 2 + btnSpacing;
            const startX = (width - totalW) / 2;

            this.buttons.push({
                label: 'Retry',
                x: startX,
                y: btnY,
                w: btnW,
                h: btnH,
                action: 'retry',
                isHovered: false
            });

            this.buttons.push({
                label: 'Main Menu',
                x: startX + btnW + btnSpacing,
                y: btnY,
                w: btnW,
                h: btnH,
                action: 'menu',
                isHovered: false
            });
        } else {
            // Victoire → 1 bouton : Main Menu centré
            this.buttons.push({
                label: 'Main Menu',
                x: (width - btnW) / 2,
                y: btnY,
                w: btnW,
                h: btnH,
                action: 'menu',
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

        // Fond bouton
        ctx.fillStyle = isHovered ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        this.roundRect(ctx, x, y, w, h, 10);
        ctx.fill();
        ctx.stroke();

        // Texte
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

                if (btn.action === 'retry') {
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
