import Level from '../base/Level.js';
import EnemySpawner from '../../behaviors/EnemySpawner.js';
import BigDot from '../../entities/enemies/BigDot.js';

export default class WasteworldMap extends Level {

    constructor() {
        super('Wasteworld', './assets/background_map/map2_background.png');
        this.player.experienceRate = 0.5;
    }

    initSpawners() {
        this.addBehavior(new EnemySpawner(
            BigDot,
            { duration: 1200, spawnInterval: 2, spawnIncrementInterval: 10 }
        ));
    }
}
