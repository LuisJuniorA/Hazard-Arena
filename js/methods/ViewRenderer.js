export default class ViewRenderer {
    constructor(ctx, levels, player, currentView) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.mapTimer = 0;
        this.mapTimerIncr = 1/60;
        this.unlockedLevels = ['map1', 'map2', 'map3', 'map4']; //todo implement a real unlocking system
        this.currentView = 'menu';
        this.backgroundImage = new Image();
        this.levels = levels;
        this.menuButtons = [
            { id: 'Level 1', label: 'Forest', yOffset: -60, map: 'map1' },
            { id: 'Level 2', label: 'Wasteworld', yOffset: -10, map: 'map2' },
            { id: 'Level 3', label: 'Snow', yOffset: 40, map: 'map3' },
            { id: 'Level 4', label: 'Complex', yOffset: 90, map: 'map4' }
        ];
        this.stars = Array.from({ length: 150 }, () => ({
            x: Math.random() * (this.canvas.width+this.canvas.height),
            y: Math.random() * this.canvas.height,
            r: Math.random() * 1.5 + 0.5
        }));
        this.menuButtons.forEach(btn => {
            btn.image = new Image();
            btn.image.src = `./assets/background_map/${btn.map}_background.png`;
            btn.minx = (this.canvas.width - Math.min(320, this.canvas.width * 0.7)) / 2;
            btn.maxx = btn.minx + Math.min(320, this.canvas.width * 0.7);
            btn.miny = (this.canvas.height - (this.menuButtons.length * 40 + (this.menuButtons.length - 1) * 15)) / 2 + btn.yOffset;
            btn.maxy = btn.miny + 40;
            btn.isHovered = false;
        });
        this.player = player;
    }

    loadMap(mapName) {
        if (this.levels[mapName] && this.unlockedLevels.includes(mapName)) {
            this.currentView = mapName;
            this.levels[mapName].backgroundImage.src = `./assets/background_map/${mapName}_background.png`;
            //todo load entities for the level
        } else {
            console.error(`Level ${mapName} does not exist.`);
        }
    }

    LoadMenu() {
        this.mapTimer = 0;
        this.currentView = 'menu';
    }

    render() {
        if (this.currentView === 'menu') {
            this.#renderMenu();
        } else {
            this.#renderBackground();
            this.#renderEntities();
        }
    }

    #renderMenu() {
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.#renderStars();


        const buttonWidth = Math.min(320, this.canvas.width * 0.7);
        const buttonHeight = 60;
        const spacing = 20;
        const totalHeight = this.menuButtons.length * buttonHeight + (this.menuButtons.length - 1) * spacing;
        const startY = (this.canvas.height - totalHeight) / 2;
        const startX = (this.canvas.width - buttonWidth) / 2;

        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('Hazard Arena', centerX, centerY - totalHeight / 2 - 80);

        
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        this.menuButtons.forEach((btn, index) => {
            const y = startY + index * (buttonHeight + spacing);
            this.#createButton(startX, y, buttonWidth, buttonHeight, `${btn.id} : ${btn.label}`, btn);
        });
    }

    #renderBackground() {
        const ctx = this.ctx;

        const cameraX = this.player.x - this.canvas.width / 2;
        const cameraY = this.player.y - this.canvas.height / 2;
        this.backgroundImage = this.levels[this.currentView].backgroundImage;
        const bgW = this.backgroundImage.width;
        const bgH = this.backgroundImage.height;
        const startX = - (cameraX % bgW);
        const startY = - (cameraY % bgH);
        for (let x = startX - bgW; x < this.canvas.width; x += bgW) {
            for (let y = startY - bgH; y < this.canvas.height; y += bgH) {
                ctx.drawImage(this.backgroundImage, x, y);
            }
        }
    }

    #renderEntities() {
        //todo render entities
        const ctx = this.ctx;
        ctx.fillStyle = 'red';
        ctx.fillRect(
            this.canvas.width / 2 - 10,
            this.canvas.height / 2 - 10,
            20,
            20
        );
        
        //les personnages et background ont tous leu vraie position + position x y du joueur pour que tout soit centré sur le joueur
        /*The player, the map, and all entities have an (x, y) position; however, since the camera is centered on the player, 
        rendering is done by offsetting every object’s position by the player’s coordinates. As a result, the player’s (x, y) position is mostly conceptual, 
        as the player does not truly move—only the relative positions within the map change.*/
    }    

    #renderStars() {
        const speed = 0.2;
        this.ctx.fillStyle = 'white';
        for (const star of this.stars) {
            star.y += speed;
            star.x -= speed;
            if (star.y > this.canvas.height) { // when borders y → reappear on the top with a random x
                star.y =  0;
                star.x = Math.random() * (this.canvas.width);             
            } if (star.x < 0) { // whe borders x → reappear on the right side with a random y
                star.y = Math.random() * (this.canvas.height);
                star.x = (Math.random() * (this.canvas.height)) +this.canvas.width;
            }
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    #createButton(x, y, width, height, text, btn) {
        const ctx = this.ctx;
        ctx.globalAlpha = 0.85;
        ctx.drawImage(btn.image, x, y, width, height);
        ctx.globalAlpha = 1;
        if (btn.isHovered) {
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.fillRect(x, y, width, height);
        } else {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(x, y, width, height);
        }
        ctx.fillStyle = 'white';
        ctx.fillText(text, x + width / 2, y + height / 2);

        btn.minx = x;
        btn.maxx = x + width;
        btn.miny = y;
        btn.maxy = y + height;

        //! visual debug
        // ctx.strokeStyle = 'red';
        // ctx.strokeRect(btn.minx, btn.miny, btn.maxx - btn.minx, btn.maxy - btn.miny);   
    }

    hoveringButtonHandler(mouseX, mouseY) {
        for (const btn of this.menuButtons) {
            if (mouseX >= btn.minx && mouseX <= btn.maxx && mouseY >= btn.miny && mouseY <= btn.maxy) {
                btn.isHovered = true;
            } else if (btn.isHovered) {
                btn.isHovered = false;
            }
        }
    }

    clickingButtonHandler(mouseX, mouseY) {
        let clickedButton = null;
        for (const btn of this.menuButtons) {
            if (mouseX >= btn.minx && mouseX <= btn.maxx && mouseY >= btn.miny && mouseY <= btn.maxy) {
                clickedButton = btn;
                break;
            }        
        }
        if (clickedButton) {
            this.loadMap(clickedButton.map);
        }
    }
}