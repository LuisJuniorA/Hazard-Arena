import Player from './class/Player.js';

window.onload = init;

let canvas, ctx;
let time = 0;
const timeIncr = 1/60;
let backgroundImage = new Image();
backgroundImage.src = './assets/background_map/map1_background.png';
let player;
const keys = {};

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    player = new Player(canvas.width / 2, canvas.height / 2);

    animationLoop();
}

function animationLoop(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    render();
    update();

    requestAnimationFrame(animationLoop);
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

    ctx.fillStyle = 'red';
    ctx.fillRect(
        canvas.width / 2 - 10,
        canvas.height / 2 - 10,
        20,
        20
    );
    
    //les personnages et background ont tous leu vraie position + position x y du joueur pour que tout soit centré sur le joueur
    /*The player, the map, and all entities have an (x, y) position; however, since the camera is centered on the player, 
    rendering is done by offsetting every object’s position by the player’s coordinates. As a result, the player’s (x, y) position is mostly conceptual, 
    as the player does not truly move—only the relative positions within the map change.*/
}

function update() {
    //mouvements et collisions

    playerMovement();
}

function playerMovement() {
    let dx = 0, dy = 0;
    if (keys['ArrowUp'] || keys['z'] || keys['w']) {
        dy = -1;
    }
    if (keys['ArrowDown'] || keys['s']) {
        dy = 1;
    }
    if (keys['ArrowLeft'] || keys['q'] || keys['a']) {
        dx = -1;
    }
    if (keys['ArrowRight'] || keys['d']) {
        dx = 1;
    }
    if (dx && dy) {
        dx *= Math.SQRT1_2;
        dy *= Math.SQRT1_2;
    }
    player.move(dx, dy);
}

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});