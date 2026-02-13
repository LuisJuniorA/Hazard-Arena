import EntityManager from '../../utils/EntityManager.js';
import Player from '../../entities/player/Player.js';
import assetLoader from '../../common/AssetLoader.js';
import Timer from '../../methods/hud/Timer.js';

export default class Level {

    constructor(name, backgroundSrc) {
        this.name = name;

        this.backgroundImage = assetLoader.getImage(backgroundSrc) ?? new Image();
        if (!this.backgroundImage.src) this.backgroundImage.src = backgroundSrc;

        this.upgradeFacade = null;

        this.player = new Player(canvas.width / 2, canvas.height / 2, this);

        this.enemies = [];
        this.projectiles = [];
        this.xpEntities = [];

        this.behaviors = [];
        this.timer = new Timer(15 * 60);

        // Appelé automatiquement
        this.initSpawners();
        this.timer.start();
    }

    /**
     * Méthode à override dans les maps enfants
     */
    initSpawners() { }

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

        if (this.upgradeFacade?.active) {
            this.upgradeFacade.update(dt);
            return;
        }

        for (const b of this.behaviors) b.update?.(dt);

        this.player?.update(dt, this);
        this.timer.update(dt);
        for (const e of this.enemies) e.update(dt);
        for (const p of this.projectiles) p.update(dt);
        for (const xp of this.xpEntities) xp.update(dt);

        EntityManager.cleanupInPlace(this.enemies);
        EntityManager.cleanupInPlace(this.projectiles);
        EntityManager.cleanupInPlace(this.xpEntities);
    }

    render(ctx, canvas) {

        ctx.save();

        const cameraX = this.player?.x - canvas.width / 2 || 0;
        const cameraY = this.player?.y - canvas.height / 2 || 0;

        const bg = this.backgroundImage;
        const bgW = bg.width, bgH = bg.height;

        const startX = -(cameraX % bgW);
        const startY = -(cameraY % bgH);

        for (let x = startX - bgW; x < canvas.width; x += bgW) {
            for (let y = startY - bgH; y < canvas.height; y += bgH) {
                ctx.drawImage(bg, x, y);
            }
        }

        if (!this.upgradeFacade?.active) {
            for (const e of this.enemies) e.render(ctx, canvas);
            for (const p of this.projectiles) p.render(ctx, canvas, this.player);
            for (const xp of this.xpEntities) xp.render?.(ctx, canvas, this.player);
            this.player?.render(ctx, canvas);
        }

        this.upgradeFacade?.render(ctx, canvas);

        ctx.restore();
        this.timer.render(ctx, canvas);
    }

    addBehavior(behavior) {
        behavior.onAttach(this, this.level);
        this.behaviors.push(behavior);
    }
}
