import ViewRenderer from './methods/ViewRenderer.js';
import ForestMap from './maps/children/ForestMap.js';
import WasteworldMap from './maps/children/WasteworldMap.js';
import SnowMap from './maps/children/SnowMap.js';
import ComplexMap from './maps/children/ComplexMap.js';
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
let level;

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
    const start = performance.now();
    console.log("Loading assets...");
    await loader.loadAll();
    console.log("Assets loaded");
    const end = performance.now();
    console.log(`Temps de chargement: ${(end - start).toFixed(2)} ms`);


    // -------- Levels --------
    const levels = {
        map1: ForestMap,
        map2: WasteworldMap,
        map3: SnowMap,
        map4: ComplexMap
    };

    // -------- View Renderer --------
    viewRenderer = new ViewRenderer(ctx, levels);

    // -------- Input clavier --------
    window.addEventListener('keydown', e => keys[e.key] = true);
    window.addEventListener('keyup', e => keys[e.key] = false);


    //auto play musique menu au premier click (obligation de faire ça à cause des restrictions de lecture automatique des navigateurs)
    //il autorise ensuite toutes les actions
    window.addEventListener('click', e => {
        soundManager.playMusic('mainMenu'); 
        document.getElementById('hider').style.display = 'none';

        // -------- Input souris (menu) --------
        window.addEventListener('mousemove', e => {
            viewRenderer.handleMouseMove(e.clientX, e.clientY);
        });

        window.addEventListener('click', e => {
            viewRenderer.handleClick(e.clientX, e.clientY);
            if (!level?.upgradeFacade) return;
            level.upgradeFacade?.buttons.forEach(btn =>
                btn.isClicked(e.clientX, e.clientY)
            );
        });
    },{ once: true });

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
    if (!level || !level.player || level.upgradeFacade?.active) return;

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
        level = viewRenderer.currentLevel;
        handlePlayerMovement(level);
        level.update(dt);
    }

    // -------- Render (menu OU level) --------
    viewRenderer.render();

    requestAnimationFrame(loop);
}
