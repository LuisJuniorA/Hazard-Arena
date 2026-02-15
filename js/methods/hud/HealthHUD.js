export default class HealthHUD {

    constructor(player) {
        this.player = player;

        // Animation de la barre (effet smooth quand on perd de la vie)
        this.displayedHealth = player.hp;
        this.lerpSpeed = 8; // vitesse d'interpolation
    }

    update(dt) {
        // interpolation douce vers la vraie vie
        this.displayedHealth +=
            (this.player.hp - this.displayedHealth) * this.lerpSpeed * dt;

        // évite les micro décimales infinies
        if (Math.abs(this.displayedHealth - this.player.hp) < 0.1) {
            this.displayedHealth = this.player.hp;
        }
    }

    render(ctx, canvas) {
        const width = 250;
        const height = 22;
        const x = 30;
        const y = canvas.height - 50;

        const healthPercent = this.displayedHealth / this.player.maxHealth;

        ctx.save();
        // ===== Fond (vide) =====
        ctx.fillStyle = "#222";
        ctx.fillRect(x, y, width, height);

        // ===== Barre vie =====
        ctx.fillStyle = "#e63946";
        ctx.fillRect(x, y, width * healthPercent, height);

        // ===== Bordure =====
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // ===== Texte =====
        ctx.fillStyle = "#ffffff";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; // 👈 IMPORTANT

        ctx.fillText(
            `${Math.round(this.player.hp)} / ${this.player.maxHealth}`,
            x + width / 2,
            y + height / 2 // 👈 vrai centre vertical
        );
        ctx.restore();
    }

}
