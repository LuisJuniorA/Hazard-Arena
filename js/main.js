import AvoidOtherEnemies from './behaviors/AvoidOtherEnemies.js';
import PlayerAttack from './behaviors/PlayerAttack.js';
import Player from './class/Player.js';
import Projectile from './class/Projectile.js';
import PointBlack from './class/enemy/PointBlack.js';
import EntityManager from './utils/EntityManager.js';
import ViewRenderer from './methods/ViewRenderer.js';
import Level from './class/Level.js';

window.onload = init;

const enemies = [];
const projectiles = [];

AvoidOtherEnemies.enemies = enemies;
PlayerAttack.enemies = enemies;
Projectile.projectiles = projectiles;

let canvas, ctx;
let lastTime = 0;
let backgroundImage = new Image();
backgroundImage.src = './assets/background_map/map1_background.png';
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

    player = new Player(canvas.width / 2, canvas.height / 2);

    enemies.push(new PointBlack(200, 100, player));
    enemies.push(new PointBlack(-150, 80, player));

    viewRenderer = new ViewRenderer(ctx, {
        map1: new Level('Forest','./assets/background_map/map1_background.png'),
        map2: new Level('Wasteworld', './assets/background_map/map2_background.png'),
        map3: new Level('Snow', './assets/background_map/map3_background.png'),
        map4: new Level('Complex', './assets/background_map/map4_background.png')
    }, player);

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

    animationLoop(0);
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
        // console.log(keys); // debug keys
        pastKeys = JSON.parse(JSON.stringify(keys));
    }
}

function update(dt) {
    // Mouvements et comportements
    playerMovement();
    for (const p of projectiles) p.update(dt);
    for (const e of enemies) e.update(dt);
    player.update(dt);

    // Cleanup in-place
    EntityManager.cleanupInPlace(enemies);
    EntityManager.cleanupInPlace(projectiles);
}

function render() {
    const cameraX = player.x - canvas.width / 2;
    const cameraY = player.y - canvas.height / 2;

    const bgW = backgroundImage.width;
    const bgH = backgroundImage.height;

    const startX = - (cameraX % bgW);
    const startY = - (cameraY % bgH);

    for (let x = startX - bgW; x < canvas.width; x += bgW) {
        for (let y = startY - bgH; y < canvas.height; y += bgH) {
            ctx.drawImage(backgroundImage, x, y);
        }
    }

    player.render(ctx, canvas);
    for (const p of projectiles) p.render(ctx, canvas, player);
    for (const e of enemies) e.render(ctx, canvas);
}

function animationLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    update(dt);
    render();

    requestAnimationFrame(animationLoop);
}
