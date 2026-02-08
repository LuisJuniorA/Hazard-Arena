// EnemySpawnerBehavior.js
export default class EnemySpawner {
    /**
     * @param {Array} enemies - tableau d'ennemis du level
     * @param {Player} player - référence du joueur
     * @param {Function} enemyClass - classe d'ennemi à instancier
     * @param {Object} options - configuration
     */
    constructor(enemies, player, enemyClass, options = {}) {
        this.enemies = enemies;
        this.player = player;
        this.enemyClass = enemyClass;

        // Config
        this.duration = options.duration ?? 15 * 60; // secondes
        this.timeElapsed = 0;

        this.spawnInterval = options.spawnInterval ?? 1; // base spawn/sec
        this.spawnTimer = 0;

        this.spawnIncrementInterval = options.spawnIncrementInterval ?? 5; // chaque X sec
        this.lastIncrement = 0;

        this.enemiesPerSpawn = 0; // start 1/s 
    }

    update(dt, level) {
        this.timeElapsed += dt;
        this.spawnTimer += dt;

        // Augmente la cadence tous les spawnIncrementInterval
        if (this.timeElapsed - this.lastIncrement >= this.spawnIncrementInterval) {
            this.enemiesPerSpawn += 1;
            this.lastIncrement = this.timeElapsed;
        }

        // Spawn si timer atteint
        if (this.spawnTimer >= 1 / this.enemiesPerSpawn) {
            this.spawnEnemies(level);
            this.spawnTimer = 0;
        }

        // Stop après durée de map
        if (this.timeElapsed >= this.duration) {
            this.spawnTimer = Infinity;
        }
    }

    spawnEnemies(level) {
        for (let i = 0; i < this.enemiesPerSpawn; i++) {
            const pos = this.getSpawnPosition(level);
            const enemy = new this.enemyClass(pos.x, pos.y, level);
            level.addEnemy(enemy);
        }
    }

    getSpawnPosition() {
        // Spawn aléatoire autour du joueur, hors écran
        const distance = 400 + Math.random() * 200; // spawn à 400-600 px
        const angle = Math.random() * Math.PI * 2;
        const x = this.player.x + Math.cos(angle) * distance;
        const y = this.player.y + Math.sin(angle) * distance;
        return { x, y };
    }
}
