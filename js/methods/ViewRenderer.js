import soundManager from '../common/soundInstance.js';
import assetLoader from '../common/AssetLoader.js';
import AbilityHUD from './hud/AbilityHUD.js';
import HUDManager from './HUDManager.js';
import HealthHUD from './hud/HealthHUD.js';
import ExperienceHUD from './hud/ExperienceHUD.js';

export default class ViewRenderer {
    constructor(ctx, levelClasses) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;

        // Vue actuelle : 'menu' ou nom de map
        this.currentView = 'menu';

        // ⚠️ On stocke les CLASSES, pas les instances
        this.levelClasses = levelClasses;

        // Instance active uniquement
        this.currentLevel = null;

        // -------- Levels unlock --------
        this.unlockedLevels = ['map1', 'map2', 'map3', 'map4']; // TODO: vrai système

        // -------- Menu --------
        this.menuButtons = [
            { id: 'Level 1', label: 'Forest', map: 'map1' },
            { id: 'Level 2', label: 'Wasteworld', map: 'map2' },
            { id: 'Level 3', label: 'Snow', map: 'map3' },
            { id: 'Level 4', label: 'Complex', map: 'map4' }
        ];

        this.menuButtons.forEach(btn => {
            btn.image = assetLoader.getImage(`./assets/background_map/${btn.map}_background.png`);
            btn.isHovered = false;
            btn.minx = 0;
            btn.miny = 0;
            btn.maxx = 0;
            btn.maxy = 0;
        });

        // -------- Stars background --------
        this.stars = Array.from({ length: 150 }, () => ({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            r: Math.random() * 1.5 + 0.5
        }));
        this.hudManager = new HUDManager();
        this.abilityHUD = null;
    }

    // =====================================================
    // VIEW MANAGEMENT
    // =====================================================

    loadMap(mapName) {
        if (!this.unlockedLevels.includes(mapName)) return;

        const LevelClass = this.levelClasses[mapName];

        if (!LevelClass) {
            console.error(`Level class "${mapName}" not found`);
            return;
        }

        // 🔥 Nettoyage ancienne instance
        if (this.currentLevel?.destroy) {
            this.currentLevel.destroy();
        }

        // ✅ Instanciation lazy
        this.currentLevel = new LevelClass();

        soundManager.loadMap(mapName);
        this.currentView = mapName;
        this.currentLevel = new LevelClass();
        this.currentLevel._viewRenderer = this; // ref pour EndScreen retry/menu

        this.hudManager.clear();

        this.hudManager.add(new AbilityHUD(this.currentLevel.player));
        this.hudManager.add(new HealthHUD(this.currentLevel.player));
        this.hudManager.add(new ExperienceHUD(this.currentLevel.player));
    }

    loadMenu() {
        // 🔥 Nettoyage si on revient au menu
        if (this.currentLevel?.destroy) {
            this.currentLevel.destroy();
        }

        this.currentLevel = null;
        this.currentView = 'menu';
        soundManager.playMusic('mainMenu');
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    // =====================================================
    // UPDATE
    // =====================================================

    update(dt) {
        if (this.currentView !== 'menu') {
            this.currentLevel?.update(dt);
            this.hudManager.update(dt);
        }
    }

    // =====================================================
    // MAIN RENDER
    // =====================================================

    render() {
        this.ctx.save();
        if (this.currentView === 'menu') {
            this.#renderMenu();
        } else {
            this.currentLevel?.render(this.ctx, this.canvas);
            this.hudManager.render(this.ctx, this.canvas);
        }
        this.ctx.restore();
    }

    // =====================================================
    // MENU RENDER
    // =====================================================

    #renderMenu() {
        const ctx = this.ctx;
        const { width, height } = this.canvas;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);

        this.#renderStars();

        const buttonWidth = Math.min(320, width * 0.7);
        const buttonHeight = 60;
        const spacing = 20;

        const totalHeight =
            this.menuButtons.length * buttonHeight +
            (this.menuButtons.length - 1) * spacing;

        const startX = (width - buttonWidth) / 2;
        const startY = (height - totalHeight) / 2;

        // -------- Title --------
        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('Hazard Arena', width / 2, startY - 90);

        // -------- Buttons --------
        ctx.font = '20px Arial';
        ctx.textBaseline = 'middle';

        this.menuButtons.forEach((btn, i) => {
            const y = startY + i * (buttonHeight + spacing);

            this.#renderButton(
                startX,
                y,
                buttonWidth,
                buttonHeight,
                `${btn.id} : ${btn.label}`,
                btn
            );
        });
    }

    #renderButton(x, y, w, h, text, btn) {
        const ctx = this.ctx;

        ctx.globalAlpha = 0.85;
        ctx.drawImage(btn.image, x, y, w, h);
        ctx.globalAlpha = 1;

        ctx.fillStyle = btn.isHovered
            ? 'rgba(255,255,255,0.3)'
            : 'rgba(0,0,0,0.5)';
        ctx.fillRect(x, y, w, h);

        ctx.fillStyle = 'white';
        ctx.fillText(text, x + w / 2, y + h / 2);

        // Hitbox
        btn.minx = x;
        btn.maxx = x + w;
        btn.miny = y;
        btn.maxy = y + h;
    }

    // =====================================================
    // STARS BACKGROUND
    // =====================================================

    #renderStars() {
        const speed = 0.2;
        const ctx = this.ctx;
        const { width, height } = this.canvas;

        ctx.fillStyle = 'white';

        for (const s of this.stars) {
            s.x -= speed;
            s.y += speed;

            if (s.y > height) {
                s.y = 0;
                s.x = Math.random() * width;
            }

            if (s.x < 0) {
                s.x = width + Math.random() * height;
                s.y = Math.random() * height;
            }

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // =====================================================
    // INPUT HANDLING
    // =====================================================

    handleMouseMove(x, y) {
        // EndScreen hover
        if (this.currentLevel?.endScreen?.active) {
            this.currentLevel.endScreen.handleMouseMove(x, y);
            return;
        }

        if (this.currentView !== 'menu') return;

        for (const btn of this.menuButtons) {
            btn.isHovered =
                x >= btn.minx &&
                x <= btn.maxx &&
                y >= btn.miny &&
                y <= btn.maxy;
        }
    }

    handleClick(x, y) {
        // EndScreen click
        if (this.currentLevel?.endScreen?.active) {
            this.currentLevel.endScreen.handleClick(x, y);
            return;
        }

        if (this.currentView !== 'menu') return;

        for (const btn of this.menuButtons) {
            if (
                x >= btn.minx &&
                x <= btn.maxx &&
                y >= btn.miny &&
                y <= btn.maxy
            ) {
                this.loadMap(btn.map);
                break;
            }
        }
    }
}
