import EntityManager from '../../utils/EntityManager.js';
import Player from '../../entities/player/Player.js';
import assetLoader from '../../common/AssetLoader.js';
import Timer from '../../methods/hud/Timer.js';
import EndScreen from '../../methods/hud/EndScreen.js';
import PauseScreen from '../../methods/hud/PauseScreen.js';
import PauseButtonHUD from '../../methods/hud/PauseButtonHUD.js';

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
        this.timer = new Timer(7.5 * 60);

        this.endScreen = new EndScreen();
        this.pauseScreen = new PauseScreen();
        this.pauseButtonHUD = new PauseButtonHUD(this);
        this.gameOver = false;

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

        if (this.endScreen.active) {
            this.endScreen.update(dt);
            return;
        }

        if (this.pauseScreen.active) {
            this.pauseScreen.update(dt);
            return;
        }

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

        // --- Détection fin de partie ---
        this.checkEndConditions();

        EntityManager.cleanupInPlace(this.enemies);
        EntityManager.cleanupInPlace(this.projectiles);
        EntityManager.cleanupInPlace(this.xpEntities);
    }

    checkEndConditions() {
        if (this.gameOver) return;

        if (this.player && this.player.hp <= 0) {// potenetiellement changer la detection pour les amélioration liés à la mort
            this.triggerEnd(false);
            return;
        }

        for (const e of this.enemies) {
            if (e.isBoss && e._deathHandled && e.dead) {
                this.triggerEnd(true);
                return;
            }
        }
    }

    triggerEnd(victory) {
        this.gameOver = true;
        this.timer.pause();

        const elapsed = this.timer.duration - this.timer.timeLeft;
        const min = Math.floor(elapsed / 60);
        const sec = Math.floor(elapsed % 60).toString().padStart(2, '0');

        this.endScreen.open({
            victory,
            playerLevel: this.player?.levelNumber ?? 0,
            timeElapsed: `${min}:${sec}`,
            viewRenderer: this._viewRenderer
        });
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

        if (!this.upgradeFacade?.active && !this.pauseScreen.active && !this.endScreen.active) {
            for (const e of this.enemies) e.render(ctx, canvas);
            for (const p of this.projectiles) p.render(ctx, canvas, this.player);
            for (const xp of this.xpEntities) xp.render?.(ctx, canvas, this.player);
            this.player?.render(ctx, canvas);
        }

        ctx.restore();
        this.timer.render(ctx, canvas);
        this.renderArena(ctx, canvas);
        this.upgradeFacade?.render(ctx, canvas);
        this.pauseButtonHUD.render(ctx, canvas);
        this.endScreen.render(ctx, canvas);
        this.pauseScreen.render(ctx, canvas);
    }

    renderArena(ctx, canvas) {
        if (!this.arena || !this.player) return;

        const { x, y, radius } = this.arena;
        const player = this.player;

        const screenX = x - player.x + canvas.width / 2;
        const screenY = y - player.y + canvas.height / 2;

        ctx.save();

        // Glow
        ctx.shadowColor = "rgba(255, 0, 150, 0.8)";
        ctx.shadowBlur = 30;

        ctx.beginPath();
        ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 0, 150, 0.9)";
        ctx.lineWidth = 8;
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Zone intérieure
        ctx.beginPath();
        ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 0, 150, 0.05)";
        ctx.fill();

        ctx.restore();
    }


    addBehavior(behavior) {
        behavior.onAttach(this, this.level);
        this.behaviors.push(behavior);
    }
}
