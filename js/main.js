import PointBlack from './class/enemy/PointBlack.js';
import Level from './class/Level.js';
import ViewRenderer from './methods/ViewRenderer.js';

window.onload = init;

let canvas, ctx;
let lastTime = 0;
let player;
let viewRenderer;
let currentLevel;
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
    player = map1.player;

    currentLevel = map1;

    // ViewRenderer avec toutes les maps
    viewRenderer = new ViewRenderer(ctx, {
        map1,
        map2: new Level('Wasteworld', './assets/background_map/map2_background.png'),
        map3: new Level('Snow', './assets/background_map/map3_background.png'),
        map4: new Level('Complex', './assets/background_map/map4_background.png')
    }, player);

    // Input
    window.addEventListener('keydown', e => keys[e.key] = true);
    window.addEventListener('keyup', e => keys[e.key] = false);

    window.addEventListener('click', e => {
        if (viewRenderer.currentView === 'menu') {
            const clickedButton = viewRenderer.clickingButtonHandler(e.clientX, e.clientY);
            if (clickedButton) viewRenderer.loadMap(clickedButton.map);
        }
    });

    window.addEventListener('mousemove', e => {
        if (viewRenderer.currentView === 'menu') {
            viewRenderer.hoveringButtonHandler(e.clientX, e.clientY);
        }
    });

    requestAnimationFrame(animationLoop);
}

function handlePlayerMovement() {
    let dx = 0, dy = 0;
    if (keys['ArrowUp'] || keys['z'] || keys['w']) dy -= 1;
    if (keys['ArrowDown'] || keys['s']) dy += 1;
    if (keys['ArrowLeft'] || keys['q'] || keys['a']) dx -= 1;
    if (keys['ArrowRight'] || keys['d']) dx += 1;

    player.move(dx, dy);
}

function animationLoop(timestamp) {
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    handlePlayerMovement();

    // Tout passe par le level maintenant
    currentLevel.update(dt);
    currentLevel.render(ctx, canvas);

    requestAnimationFrame(animationLoop);
}
