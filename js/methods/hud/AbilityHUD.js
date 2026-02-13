export default class AbilityHUD {
    constructor(player) {
        this.player = player;
    }

    update(dt) {
        // généralement pas nécessaire
    }

    render(ctx, canvas) {
        if (!this.player) return;

        const abilities = [];

        for (const upgrade of this.player.upgrades) {
            const info = upgrade.getCooldownInfo?.(this.player);
            if (info) abilities.push(info);
        }

        if (abilities.length === 0) return;

        const radius = 28;
        const lineWidth = 5;
        const spacing = 70;
        const startX = canvas.width - 60;
        const startY = canvas.height - 60;
        const minX = canvas.width * 0.67;

        for (let i = 0; i < abilities.length; i++) {
            const itemsPerRow =
                Math.floor((startX - minX) / spacing) + 1;

            const indexInRow = i % itemsPerRow;
            const rowIndex = Math.floor(i / itemsPerRow);

            const cx = startX - indexInRow * spacing;
            const cy = startY - rowIndex * spacing;

            this.renderOneAbility(
                ctx,
                cx,
                cy,
                radius,
                lineWidth,
                abilities[i]
            );
        }
    }

    renderOneAbility(ctx, cx, cy, radius, lineWidth, info) {
        const { name, key, cooldown, timer, active } = info;
        const ready = timer <= 0 && !active;
        const progress = ready ? 1 : 1 - timer / cooldown;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(40,40,40,0.6)';
        ctx.fill();

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.stroke();

        if (!ready) {
            const startAngle = -Math.PI / 2;
            const endAngle = startAngle + progress * Math.PI * 2;

            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = 'rgba(0,180,255,0.35)';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(cx, cy, radius, startAngle, endAngle);
            ctx.strokeStyle = 'rgba(0,180,255,0.8)';
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0,220,255,0.9)';
            ctx.stroke();
        }

        ctx.fillStyle = ready
            ? '#fff'
            : 'rgba(255,255,255,0.5)';

        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(
            ready ? name : `${Math.ceil(timer)}s`,
            cx,
            cy
        );

        if (key) {
            ctx.font = '10px Arial';
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fillText(key, cx, cy + radius + 14);
        }
    }
}
