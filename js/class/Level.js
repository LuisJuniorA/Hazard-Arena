import AvoidOtherEnemies from "../behaviors/AvoidOtherEnemies.js";
import PlayerAttack from "../behaviors/PlayerAttack.js";
import Projectile from "./Projectile.js";

export default class Level {
    constructor(name, backgroundSrc) {
        this.name = name;
        this.backgroundImage = new Image();
        this.backgroundImage.src = backgroundSrc;

        this.player = null;          // joueur
        this.enemies = [];           // ennemis
        this.projectiles = [];       // projectiles
        this.xpEntities = [];        // XP drops

        this.width = 2000;
        this.height = 2000;
        AvoidOtherEnemies.enemies = this.enemies;
        PlayerAttack.enemies = this.enemies;
        Projectile.projectiles = this.projectiles;
    }

    // -------- Player --------
    setPlayer(player) {
        this.player = player;
    }

    // -------- Enemies --------
    addEnemy(enemy) {
        this.enemies.push(enemy);
    }

    // -------- Projectiles --------
    addProjectile(proj) {
        this.projectiles.push(proj);
    }

    // -------- XP --------
    addXP(xp) {
        this.xpEntities.push(xp);
    }

    // -------- Render --------
    render(ctx, canvas) {
        if (!this.player) return;
        const player = this.player;

        // Background centré sur le joueur
        const bgW = this.backgroundImage.width;
        const bgH = this.backgroundImage.height;
        const cameraX = player.x - canvas.width / 2;
        const cameraY = player.y - canvas.height / 2;

        const startX = - (cameraX % bgW);
        const startY = - (cameraY % bgH);

        for (let x = startX - bgW; x < canvas.width; x += bgW) {
            for (let y = startY - bgH; y < canvas.height; y += bgH) {
                ctx.drawImage(this.backgroundImage, x, y);
            }
        }

        // Entities
        for (const e of this.enemies) e.render(ctx, canvas);
        for (const p of this.projectiles) p.render(ctx, canvas, player);
        for (const xp of this.xpEntities) xp.render(ctx, canvas, player);

        // Player
        player.render(ctx, canvas);
    }
}
