import AvoidOtherEnemies from './behaviors/AvoidOtherEnemies.js';
import PlayerAttack from './behaviors/PlayerAttack.js';
import Player from './class/Player.js';
import Projectile from './class/Projectile.js';
import PointBlack from './class/enemy/PointBlack.js';
import EntityManager from './utils/EntityManager.js';
import ViewRenderer from './methods/ViewRenderer.js';
import Level from './class/Level.js';

window.onload = init;

let canvas, ctx;
let lastTime = 0;
let player;
let viewRenderer;
const keys = {};

function init() {
    canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Création du Level
    const map1 = new Level('Forest', './assets/background_map/map1_background.png');

    // Création du joueur
    player = new Player(canvas.width / 2, canvas.height / 2, map1);
    map1.setPlayer(player);

    // Spawn des ennemis
    const e1 = new PointBlack(200, 100, map1);
    const e2 = new PointBlack(-150, 80, map1);
    map1.addEnemy(e1);
    map1.addEnemy(e2);
    // ViewRenderer avec les maps
    viewRenderer = new ViewRenderer(ctx, {
        map1,
        map2: new Level('Wasteworld', './assets/background_map/map2_background.png'),
        map3: new Level('Snow', './assets/background_map/map3_background.png'),
        map4: new Level('Complex', './assets/background_map/map4_background.png')
    }, player);

    // Input
    window.addEventListener('keydown', (e) => keys[e.key] = true);
    window.addEventListener('keyup', (e) => keys[e.key] = false);

    window.addEventListener('click', (e) => {
        if (viewRenderer.currentView === 'menu') {
            const clickedButton = viewRenderer.clickingButtonHandler(e.clientX, e.clientY);
            if (clickedButton) viewRenderer.loadMap(clickedButton.map);
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (viewRenderer.currentView === 'menu') {
            viewRenderer.hoveringButtonHandler(e.clientX, e.clientY);
        }
    });

    animationLoop(0, map1);
}

let pastKeys = {};

function playerMovement() {
    let dx = 0, dy = 0;
    if (keys['ArrowUp'] || keys['z'] || keys['w']) dy -= 1;
    if (keys['ArrowDown'] || keys['s']) dy += 1;
    if (keys['ArrowLeft'] || keys['q'] || keys['a']) dx -= 1;
    if (keys['ArrowRight'] || keys['d']) dx += 1;

    player.move(dx, dy);

    if (JSON.stringify(keys) !== JSON.stringify(pastKeys)) {
        pastKeys = JSON.parse(JSON.stringify(keys));
    }
}

function update(dt, level) {
    playerMovement();

    // Update toutes les entités via level
    for (const p of level.projectiles) p.update(dt, level);
    for (const e of level.enemies) e.update(dt, level);
    for (const xp of level.xpEntities) xp.update?.(dt, level); // si besoin
    player.update(dt);

    // Cleanup
    EntityManager.cleanupInPlace(level.enemies);
    EntityManager.cleanupInPlace(level.projectiles);
    EntityManager.cleanupInPlace(level.xpEntities);
}

function render(level) {
    const player = level.player;
    const cameraX = player.x - canvas.width / 2;
    const cameraY = player.y - canvas.height / 2;

    const bg = level.backgroundImage;
    const bgW = bg.width;
    const bgH = bg.height;

    const startX = - (cameraX % bgW);
    const startY = - (cameraY % bgH);

    for (let x = startX - bgW; x < canvas.width; x += bgW) {
        for (let y = startY - bgH; y < canvas.height; y += bgH) {
            ctx.drawImage(bg, x, y);
        }
    }

    // Render toutes les entités
    player.render(ctx, canvas);
    for (const xp of level.xpEntities) xp.render(ctx, canvas, player);
    for (const p of level.projectiles) p.render(ctx, canvas, player);
    for (const e of level.enemies) e.render(ctx, canvas);
}

function animationLoop(timestamp, level) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    update(dt, level);
    render(level);

    requestAnimationFrame(ts => animationLoop(ts, level));
}
