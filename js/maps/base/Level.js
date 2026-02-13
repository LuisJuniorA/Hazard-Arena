import EntityManager from '../../utils/EntityManager.js';
import Player from '../../entities/player/Player.js';
import assetLoader from '../../common/AssetLoader.js';
import Timer from '../../methods/Timer.js';

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
        this.renderAbilityCooldowns(ctx, canvas);
    }

    // -------- HUD : Cooldown des compétences actives --------
    renderAbilityCooldowns(ctx, canvas) {
        if (!this.player) return;

        // Collecter les infos de cooldown de toutes les upgrades actives
        const abilities = [];
        for (const upgrade of this.player.upgrades) {
            const info = upgrade.getCooldownInfo?.(this.player);
            if (info) abilities.push(info);
        }
        if (abilities.length === 0) return;

        const radius = 28;
        const lineWidth = 5;
        const spacing = 70; // espace entre chaque icône
        const startX = canvas.width - 60; // première position en bas à droite
        const startY = canvas.height - 60;
        const minX = canvas.width * 0.67; // limite à 33% de largeur depuis la droite

        ctx.save();

        for (let i = 0; i < abilities.length; i++) {
            // Calcul de la position en grille (droite → gauche, puis remonte)
            let cx = startX - i * spacing;
            let row = 0;
            while (cx < minX) {
                row++;
                cx += Math.floor((startX - minX) / spacing + 1) * spacing;
            }
            // Recalculer cx pour cette ligne
            const itemsPerRow = Math.floor((startX - minX) / spacing) + 1;
            const indexInRow = i % itemsPerRow;
            const rowIndex = Math.floor(i / itemsPerRow);
            cx = startX - indexInRow * spacing;
            const cy = startY - rowIndex * spacing;
            this.renderOneAbility(ctx, cx, cy, radius, lineWidth, abilities[i]);
        }

        ctx.restore();
    }

    renderOneAbility(ctx, cx, cy, radius, lineWidth, info) {
        const { name, key, cooldown, timer, active } = info;
        const ready = timer <= 0 && !active;
        const progress = ready ? 1 : 1 - (timer / cooldown);

        // --- Cercle de fond délavé ---
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(40, 40, 40, 0.6)';
        ctx.fill();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.stroke();

        // --- Arc de remplissage (progression du cooldown) ---
        if (!ready) {
            const startAngle = -Math.PI / 2;
            const endAngle = startAngle + progress * Math.PI * 2;

            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = 'rgba(0, 180, 255, 0.35)';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(cx, cy, radius, startAngle, endAngle);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = 'rgba(0, 180, 255, 0.8)';
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = 'rgba(0, 220, 255, 0.9)';
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(0, 220, 255, 0.3)';
            ctx.stroke();
        }

        // --- Texte central ---
        ctx.fillStyle = ready ? '#ffffff' : 'rgba(255, 255, 255, 0.5)';
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (!ready) {
            ctx.fillText(`${Math.ceil(timer)}s`, cx, cy);
        } else {
            ctx.fillText(name, cx, cy);
        }

        // --- Label touche sous le cercle ---
        if (key) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '10px Arial';
            ctx.fillText(key, cx, cy + radius + 14);
        }
    }

    addBehavior(behavior) {
        behavior.onAttach(this, this.level);
        this.behaviors.push(behavior);
    }
}
