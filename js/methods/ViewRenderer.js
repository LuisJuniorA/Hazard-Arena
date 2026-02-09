export default class ViewRenderer {
    constructor(ctx, levels) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;

        // views: 'menu' | mapName
        this.currentView = 'menu';

        // -------- Levels --------
        this.levels = levels;
        this.unlockedLevels = ['map1', 'map2', 'map3', 'map4']; // TODO: real unlock system

        // -------- Menu --------
        this.menuButtons = [
            { id: 'Level 1', label: 'Forest', map: 'map1' },
            { id: 'Level 2', label: 'Wasteworld', map: 'map2' },
            { id: 'Level 3', label: 'Snow', map: 'map3' },
            { id: 'Level 4', label: 'Complex', map: 'map4' }
        ];

        this.menuButtons.forEach(btn => {
            btn.image = new Image();
            btn.image.src = `./assets/background_map/${btn.map}_background.png`;
            btn.isHovered = false;
            btn.minx = btn.miny = btn.maxx = btn.maxy = 0;
        });

        // -------- Stars background --------
        this.stars = Array.from({ length: 150 }, () => ({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            r: Math.random() * 1.5 + 0.5
        }));
    }

    // =====================================================
    // VIEW MANAGEMENT
    // =====================================================

    loadMap(mapName) {
        if (!this.unlockedLevels.includes(mapName)) return;
        if (!this.levels[mapName]) {
            console.error(`Level "${mapName}" not found`);
            return;
        }
        this.currentView = mapName;
    }

    loadMenu() {
        this.currentView = 'menu';
    }

    // =====================================================
    // MAIN RENDER
    // =====================================================

    render() {
        if (this.currentView === 'menu') {
            this.#renderMenu();
        } else {
            this.levels[this.currentView]?.render(this.ctx, this.canvas);
        }
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
