import Clickable from '../../behaviors/Clickable.js';

export default class UpgradeButton {
    constructor(upgrade, index, total, width = 150, height = 250, facade) {
        this.upgrade = upgrade;
        this.index = index;
        this.total = total;
        this.width = width;
        this.height = height;
        this.facade = facade;
        this.hover = false;
        this.clicked = false;

        this.behaviors = [];
        this.addBehavior(new Clickable(() => {
            if (this.facade) {
                this.facade.apply(this.upgrade.constructor);
                this.facade.close();
            }
        }));
    }

    getPosition(canvas) {
        const spacing = 40;
        const totalWidth = this.total * this.width + (this.total - 1) * spacing;
        const startX = (canvas.width - totalWidth) / 2;
        const startY = canvas.height / 4; // ou autre fraction

        const x = startX + this.index * (this.width + spacing);
        const y = startY;

        return { x, y };
    }


    addBehavior(behavior) {
        behavior.onAttach(this, this.level);
        this.behaviors.push(behavior);
    }

    update(dt) {
        for (const b of this.behaviors) {
            if (b.enabled) b.update(dt);
        }
    }

    render(ctx, canvas) {
        this.pos = this.getPosition(canvas);
        const { x, y } = this.pos;
        const w = this.width;
        const h = this.height;
        const radius = 16;

        ctx.save();

        // ===============================
        // SHADOW
        // ===============================
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 8;

        // ===============================
        // BACKGROUND (gradient)
        // ===============================
        const gradient = ctx.createLinearGradient(x, y, x, y + h);
        gradient.addColorStop(0, this.hover ? "#2c3e50" : "#1e272e");
        gradient.addColorStop(1, "#0f1418");

        this.#roundRect(ctx, x, y, w, h, radius);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.shadowBlur = 0;

        // ===============================
        // BORDER
        // ===============================
        ctx.lineWidth = this.hover ? 4 : 2;
        ctx.strokeStyle = this.hover ? "#00d8ff" : "#555";
        this.#roundRect(ctx, x, y, w, h, radius);
        ctx.stroke();

        // ===============================
        // TITLE AREA
        // ===============================
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 18px sans-serif";
        ctx.textAlign = "center";

        const levelToShow = this.upgrade.level + 1 || 1;

        ctx.fillText(
            `${this.upgrade.name}`,
            x + w / 2,
            y + 35
        );

        // ===============================
        // LEVEL BADGE
        // ===============================
        ctx.font = "14px sans-serif";
        ctx.fillStyle = "#00d8ff";
        ctx.fillText(
            `Lvl ${levelToShow}`,
            x + w / 2,
            y + 60
        );

        // ===============================
        // SEPARATOR LINE
        // ===============================
        ctx.strokeStyle = "#444";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 20, y + 80);
        ctx.lineTo(x + w - 20, y + 80);
        ctx.stroke();

        // ===============================
        // DESCRIPTION
        // ===============================
        ctx.fillStyle = "#dfe6e9";
        ctx.font = "14px sans-serif";

        const lines = this.wrapText(ctx, this.upgrade.getDescription(), w - 40);

        lines.forEach((line, index) => {
            ctx.fillText(
                line,
                x + w / 2,
                y + 110 + index * 20
            );
        });

        ctx.restore();
    }

    #roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }



    wrapText(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let line = '';
        for (const word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line !== '') {
                lines.push(line.trim());
                line = word + ' ';
            } else {
                line = testLine;
            }
        }
        if (line) lines.push(line.trim());
        return lines;
    }

    isHovered(mouseX, mouseY) {
        if (!this.pos) return;
        return (
            mouseX >= this.pos.x &&
            mouseX <= this.pos.x + this.width &&
            mouseY >= this.pos.y &&
            mouseY <= this.pos.y + this.height
        );
    }

    isClicked(mouseX, mouseY) {
        if (this.isHovered(mouseX, mouseY)) {
            this.clicked = true;
        }
    }


}
