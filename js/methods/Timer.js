export default class Timer {
    /**
     * @param {number} duration - Durée en secondes
     * @param {object} options - Options d'affichage
     */
    constructor(duration, options = {}) {
        this.duration = duration; // en secondes
        this.timeLeft = duration;
        this.running = false;

        // Options d'affichage par défaut
        this.font = options.font || "30px Arial";
        this.color = options.color || "#fff";
        this.textAlign = options.textAlign || "center";
        this.textBaseline = options.textBaseline || "middle";
    }

    start() {
        this.running = true;
    }

    pause() {
        this.running = false;
    }

    reset() {
        this.timeLeft = this.duration;
        this.running = false;
    }

    update(dt) {
        if (!this.running) return;

        this.timeLeft -= dt;
        if (this.timeLeft < 0) {
            this.timeLeft = 0;
            this.running = false;
        }
    }

    render(ctx, canvas) {
        ctx.save();
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = Math.floor(this.timeLeft % 60).toString().padStart(2, "0");

        ctx.fillText(`${minutes}:${seconds}`, canvas.width / 2, canvas.height / 16);
        ctx.restore();
    }
}
