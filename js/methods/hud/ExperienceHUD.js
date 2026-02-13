export default class ExperienceHUD {

    constructor(player) {
        this.player = player;

        // Valeur affichée pour animation smooth
        this.displayedXP = player.experience;
        this.lerpSpeed = 6;
    }

    update(dt) {
        // interpolation douce
        this.displayedXP +=
            (this.player.experience - this.displayedXP) * this.lerpSpeed * dt;

        if (Math.abs(this.displayedXP - this.player.experience) < 0.1) {
            this.displayedXP = this.player.experience;
        }
    }

    render(ctx, canvas) {
        const width = 300;
        const height = 14;

        const x = canvas.width / 2 - width / 2;
        const y = canvas.height - 20;

        const xpPercent = this.displayedXP / 100; // car level up à 100

        // ===== Fond =====
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(x, y, width, height);

        // ===== Barre XP =====
        const gradient = ctx.createLinearGradient(x, y, x + width, y);
        gradient.addColorStop(0, "#3a86ff");
        gradient.addColorStop(1, "#8338ec");

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, width * xpPercent, height);

        // ===== Bordure =====
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);

        // ===== Texte Level =====
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";

        ctx.fillText(
            `Level ${this.player.levelNumber}`,
            canvas.width / 2,
            y - 4
        );
    }
}
