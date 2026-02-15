import Level from '../base/Level.js';
import EnemySpawner from '../../behaviors/EnemySpawner.js';
import PointBlack from '../../entities/enemies/PointBlack.js';
import PointGrey from '../../entities/enemies/PointGrey.js';
import Boss from '../../entities/base/Boss.js';

export default class ForestMap extends Level {

    constructor() {
        super('Forest', './assets/background_map/map1_background.png');
        this.player.experienceRate = 1.5;
    }

    initSpawners() {
        this.addBehavior(new EnemySpawner(
            PointBlack,
            { duration: 900, spawnInterval: 1, spawnIncrementInterval: 5 }
        ));

        setTimeout(() => {
            this.addBehavior(new EnemySpawner(
                PointGrey,
                { duration: 600, spawnInterval: 1, spawnIncrementInterval: 5 }
            ));
        }, 5 * 60 * 1000);

        setTimeout(() => {
            this.addBehavior(new EnemySpawner(
                Boss,
                { maxSpawns: 1 }
            ));
        }, 2 * 30 * 1000);
    }
}
