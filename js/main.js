import Level from './entities/Level.js';
import ViewRenderer from './methods/ViewRenderer.js';
import soundManager from './common/soundInstance.js';
import AssetLoader from './common/AssetLoader.js';

window.onload = () => init();;

// =====================================================
// GLOBALS
// =====================================================
let canvas, ctx;
let lastTime = 0;
let viewRenderer;
const keys = {};

// =====================================================
// INIT
// =====================================================
async function init() {
    // -------- Canvas --------
    canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // -------- Asset Loading --------
    const loader = new AssetLoader(soundManager);
    console.log("Loading assets...");
    await loader.loadAll();
    console.log("Assets loaded");

    // -------- Levels --------
    const levels = {
        map1: new Level('Forest', './assets/background_map/map1_background.png'),
        map2: new Level('Wasteworld', './assets/background_map/map2_background.png'),
        map3: new Level('Snow', './assets/background_map/map3_background.png'),
        map4: new Level('Complex', './assets/background_map/map4_background.png')
    };

    // -------- View Renderer --------
    viewRenderer = new ViewRenderer(ctx, levels);

    // -------- Input clavier --------
    window.addEventListener('keydown', e => keys[e.key] = true);
    window.addEventListener('keyup', e => keys[e.key] = false);

    // -------- Input souris (menu) --------
    window.addEventListener('mousemove', e => {
        viewRenderer.handleMouseMove(e.clientX, e.clientY);
    });

    window.addEventListener('click', e => {
        viewRenderer.handleClick(e.clientX, e.clientY);
    });

    // -------- Resize --------
    window.addEventListener('resize', onResize);

    requestAnimationFrame(loop);
}

// =====================================================
// RESIZE
// =====================================================
function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// =====================================================
// PLAYER INPUT
// =====================================================
function handlePlayerMovement(level) {
    if (!level || !level.player) return;

    let dx = 0;
    let dy = 0;

    if (keys['ArrowUp'] || keys['z'] || keys['w']) dy -= 1;
    if (keys['ArrowDown'] || keys['s']) dy += 1;
    if (keys['ArrowLeft'] || keys['q'] || keys['a']) dx -= 1;
    if (keys['ArrowRight'] || keys['d']) dx += 1;

    level.player.move(dx, dy);
}

// =====================================================
// MAIN LOOP
// =====================================================
function loop(timestamp) {
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // -------- Update gameplay si pas dans le menu --------
    if (viewRenderer.currentView !== 'menu') {
        const level = viewRenderer.levels[viewRenderer.currentView];
        handlePlayerMovement(level);
        level.update(dt);
    }

    // -------- Render (menu OU level) --------
    viewRenderer.render();

    requestAnimationFrame(loop);
}


window.addEventListener("mousemove", async () => {
    await audioContext.resume();
}, { once: true });
