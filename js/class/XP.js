export default class XP {
    constructor(x, y, amount = 1, color = '#FFD700') {
        this.x = x;
        this.y = y;
        this.amount = amount;
        this.color = color
        this.radius = 3; // taille
        this.dead = false; // pour EntityManager / cleanup
    }

    update(dt, level) {
        if (!level || !level.player) return;

        const player = level.player;
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < player.experienceGrabRange) {
            player.grabXp(this.amount);
            this.dead = true; // XP ramassé =  à supprimer du level
        }
    }

    render(ctx, canvas, player) {
        const screenX = this.x - player.x + canvas.width / 2;
        const screenY = this.y - player.y + canvas.height / 2;

        const size = this.radius; // la "taille" du losange

        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.moveTo(screenX, screenY - size); // sommet haut
        ctx.lineTo(screenX + size, screenY); // droite
        ctx.lineTo(screenX, screenY + size); // bas
        ctx.lineTo(screenX - size, screenY); // gauche
        ctx.closePath(); // relie au point de départ
        ctx.fill();
    }

}
