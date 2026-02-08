export default class Projectile {
    static projectiles;
    constructor(x, y, vx, vy, speed = 200, damage = 1, color = 'yellow', radius = 4) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.speed = speed;
        this.damage = damage;
        this.color = color;
        this.radius = radius;

        this.dead = false;
    }

    update(dt) {
        this.x += this.vx * this.speed * dt;
        this.y += this.vy * this.speed * dt;
    }

    render(ctx, canvas, player) {
        const screenX = this.x - player.x + canvas.width / 2;
        const screenY = this.y - player.y + canvas.height / 2;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
