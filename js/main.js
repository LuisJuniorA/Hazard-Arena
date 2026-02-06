import Player from './class/Player.js';
import ViewRenderer from './methods/ViewRenderer.js';
import Level from './class/Level.js';

window.onload = init;

let canvas, ctx;
let time = 0;
const timeIncr = 1/60;
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
    viewRenderer = new ViewRenderer(ctx,this.levels = {
            map1: new Level('Forest','./assets/background_map/map1_background.png'),
            map2: new Level('Wasteworld', './assets/background_map/map2_background.png'),
            map3: new Level('Snow', './assets/background_map/map3_background.png'),
            map4: new Level('Complex', './assets/background_map/map4_background.png')
        },player);

    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    window.addEventListener('click', (e) => {
        if (viewRenderer.currentView === 'menu') {
            if (viewRenderer.clickingButtonHandler(e.clientX, e.clientY)) {
                viewRenderer.loadMap(clickedButton.map);
            }   
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (viewRenderer.currentView === 'menu') {
            viewRenderer.hoveringButtonHandler(e.clientX, e.clientY);
        }
    });
    animationLoop();
}    


function animationLoop(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    render();
    update();

    requestAnimationFrame(animationLoop);
}

function render() {
    viewRenderer.render();
}

function update() {
    //mouvements and collisions
    playerMovement();
}
let pastKeys = {};
function playerMovement() {
    let dx = 0, dy = 0;

    if (keys['ArrowUp'] || keys['z'] || keys['w']) {
        dy += -1;
    }
    if (keys['ArrowDown'] || keys['s']) {
        dy += 1;
    }
    if (keys['ArrowLeft'] || keys['q'] || keys['a']) {
        dx += -1;
    }
    if (keys['ArrowRight'] || keys['d']) {
        dx += 1;
    }
    player.move(dx, dy);
    if (JSON.stringify(keys) !== JSON.stringify(pastKeys)) {
        //console.log(keys); //debug keys
        pastKeys = JSON.parse(JSON.stringify(keys));
    }
}