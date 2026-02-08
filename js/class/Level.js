import EntityManager from '../utils/EntityManager.js';
import EnemySpawner from '../behaviors/EnemySpawner.js'
import PointBlack from './enemy/PointBlack.js';
import PointGrey from './enemy/PointGrey.js';
import Player from './Player.js';

export default class Level {
    constructor(name, backgroundSrc) {
        this.name = name;
        this.backgroundImage = new Image();
        this.backgroundImage.src = backgroundSrc;

        this.player = new Player(canvas.width / 2, canvas.height / 2, this)
        this.enemies = [];
        this.projectiles = [];
        this.xpEntities = [];

        this.behaviors = [];
        this.behaviors.push(new EnemySpawner(
            this.enemies,
            this.player,
            PointBlack,
            { duration: 900, spawnInterval: 1, spawnIncrementInterval: 5 }
        ));

        setTimeout(() => {
            this.behaviors.push(new EnemySpawner(
                this.enemies,
                this.player,
                PointGrey,
                { duration: 600, spawnInterval: 1, spawnIncrementInterval: 5 }
            ))
        }, 5 * 60 * 1000);

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

    // -------- Update --------
    update(dt) {
        // 1: behaviors (spawner, hazards, etc.)
        for (const b of this.behaviors) b.update?.(dt, this);

        // 2: update entités
        this.player?.update(dt, this);

        for (const e of this.enemies) e.update(dt, this);
        for (const p of this.projectiles) p.update(dt, this);
        for (const xp of this.xpEntities) xp.update?.(dt, this);

        // 3: cleanup entités mortes
        EntityManager.cleanupInPlace(this.enemies);
        EntityManager.cleanupInPlace(this.projectiles);
        EntityManager.cleanupInPlace(this.xpEntities);
    }

    // -------- Render --------
    render(ctx, canvas) {
        if (!this.player) return;

        const cameraX = this.player.x - canvas.width / 2;
        const cameraY = this.player.y - canvas.height / 2;

        const bg = this.backgroundImage;
        const bgW = bg.width;
        const bgH = bg.height;
        const startX = -(cameraX % bgW);
        const startY = -(cameraY % bgH);

        // Draw background
        for (let x = startX - bgW; x < canvas.width; x += bgW) {
            for (let y = startY - bgH; y < canvas.height; y += bgH) {
                ctx.drawImage(bg, x, y);
            }
        }

        // Draw entities
        for (const e of this.enemies) e.render(ctx, canvas);
        for (const p of this.projectiles) p.render(ctx, canvas, this.player);
        for (const xp of this.xpEntities) xp.render?.(ctx, canvas, this.player);

        // Draw player last (on top)
        this.player.render(ctx, canvas);
    }
}
