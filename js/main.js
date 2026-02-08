import AvoidOtherEnemies from './behaviors/AvoidOtherEnemies.js';
import PlayerAttack from './behaviors/PlayerAttack.js';
import Player from './class/Player.js';
import Projectile from './class/Projectile.js';
import PointBlack from './class/enemy/PointBlack.js';
import EntityManager from './utils/EntityManager.js';

window.onload = init;

const enemies = [];
const projectiles = [];
AvoidOtherEnemies.enemies = enemies;
PlayerAttack.enemies = enemies;
Projectile.projectiles = projectiles;
let canvas, ctx;
let lastTime = 0;
const timeIncr = 1 / 60;
let backgroundImage = new Image();
backgroundImage.src = './assets/background_map/map1_background.png';
let player;
const keys = {};

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    player = new Player(canvas.width / 2, canvas.height / 2);
    enemies.push(new PointBlack(200, 100, player));
    enemies.push(new PointBlack(-150, 80, player));
    animationLoop(lastTime);
}

function animationLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    render();
    update(dt);

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

    player.render(ctx, canvas);
    for (const p of projectiles) p.render(ctx, canvas, player);
    for (const e of enemies) e.render(ctx, canvas);

    //les personnages et background ont tous leu vraie position + position x y du joueur pour que tout soit centré sur le joueur
    /*The player, the map, and all entities have an (x, y) position; however, since the camera is centered on the player, 
    rendering is done by offsetting every object’s position by the player’s coordinates. As a result, the player’s (x, y) position is mostly conceptual, 
    as the player does not truly move—only the relative positions within the map change.*/
}

function update(dt) {
    //mouvements et collisions

    playerMovement();
    for (const p of projectiles) p.update(dt);
    for (const e of enemies) e.update(dt);
    player.update(dt);
    EntityManager.cleanupInPlace(enemies);
    EntityManager.cleanupInPlace(projectiles);

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
    player.move(dx, dy);
}

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});