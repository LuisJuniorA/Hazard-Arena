import Clickable from '../behaviors/Clickable.js';

export default class UpgradeButton {
    constructor(upgrade, index, total, width = 150, height = 250, facade) {
        this.upgrade = upgrade;
        this.index = index;
        this.total = total;
        this.width = width;
        this.height = height;
        this.facade = facade;
        this.hover = false;

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
        ctx.save();
        ctx.fillStyle = this.hover ? '#ccc' : '#eee';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        ctx.strokeRect(this.pos.x, this.pos.y, this.width, this.height);

        ctx.fillStyle = '#000';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
            this.upgrade.name + (this.upgrade.level ? ` Lv${this.upgrade.level}` : ''),
            this.pos.x + this.width / 2,
            this.pos.y + 30
        );

        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        const lines = this.wrapText(ctx, this.upgrade.getDescription(), this.width - 20);
        lines.forEach((line, index) => {
            ctx.fillText(line, this.pos.x + this.width / 2, this.pos.y + 60 + index * 18);
        });

        ctx.restore();
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


}
