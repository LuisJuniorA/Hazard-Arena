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
        this.duration = options.duration ?? 7.5 * 60;
        this.spawnInterval = options.spawnInterval ?? 1;
        this.spawnIncrementInterval = options.spawnIncrementInterval ?? 5;

        this.maxSpawns = options.maxSpawns ?? Infinity; // <- nouveau
        this.spawnedCount = 0;

        // State
        this.timeElapsed = 0;
        this.spawnTimer = 0;
        this.lastIncrement = 0;
        this.enemiesPerSpawn = 1;
    }

    update(dt) {
        const level = this.entity;
        const player = level.player;
        if (!level || !player || !this.enabled) return;

        if (this.spawnedCount >= this.maxSpawns) return; // stop if max reached

        this.timeElapsed += dt;
        this.spawnTimer += dt;

        if (this.timeElapsed - this.lastIncrement >= this.spawnIncrementInterval) {
            this.enemiesPerSpawn++;
            this.lastIncrement = this.timeElapsed;
        }

        if (this.spawnTimer >= 1 / this.spawnInterval) {
            this.spawn(level, player);
            this.spawnTimer = 0;
        }

        if (this.timeElapsed >= this.duration) {
            this.enabled = false;
        }
    }

    spawn(level, player) {
        for (let i = 0; i < this.enemiesPerSpawn; i++) {
            if (this.spawnedCount >= this.maxSpawns) return;
            const pos = this.getSpawnPosition(player);
            const enemy = new this.enemyClass(pos.x, pos.y, level);
            level.addEnemy(enemy);
            this.spawnedCount++;
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
