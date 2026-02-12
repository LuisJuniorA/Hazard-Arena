import Behavior from '../entities/base/Behavior.js';

export default class EnemySpawner extends Behavior {
    /**
     * @param {Function} enemyClass - classe d'ennemi à instancier
     * @param {Object} options - configuration
     */
    constructor(enemyClass, options = {}) {
        super();

        this.enemyClass = enemyClass;

        // Config
        this.duration = options.duration ?? 15 * 60; // secondes
        this.spawnInterval = options.spawnInterval ?? 1; // ennemis/sec initial
        this.spawnIncrementInterval = options.spawnIncrementInterval ?? 5;

        // State
        this.timeElapsed = 0;
        this.spawnTimer = 0;
        this.lastIncrement = 0;
        this.enemiesPerSpawn = 1;
    }

    update(dt) {
        const level = this.entity;
        const player = level.player;
        if (!level || !player) return;

        this.timeElapsed += dt;
        this.spawnTimer += dt;

        // augmente la pression
        if (this.timeElapsed - this.lastIncrement >= this.spawnIncrementInterval) {
            this.enemiesPerSpawn++;
            this.lastIncrement = this.timeElapsed;
        }

        // spawn
        if (this.spawnTimer >= 1 / this.spawnInterval) {
            this.spawn(level, player);
            this.spawnTimer = 0;
        }

        // fin du spawner
        if (this.timeElapsed >= this.duration) {
            this.enabled = false;
        }
    }

    spawn(level, player) {
        for (let i = 0; i < this.enemiesPerSpawn; i++) {
            const pos = this.getSpawnPosition(player);
            const enemy = new this.enemyClass(pos.x, pos.y, level);
            level.addEnemy(enemy);
        }
    }

    getSpawnPosition(player) {
        const distance = 400 + Math.random() * 200;
        const angle = Math.random() * Math.PI * 2;

        return {
            x: player.x + Math.cos(angle) * distance,
            y: player.y + Math.sin(angle) * distance
        };
    }
}
