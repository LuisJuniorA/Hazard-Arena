import Level from '../base/Level.js';
import EnemySpawner from '../../behaviors/EnemySpawner.js';
import PointBlack from '../../entities/enemies/PointBlack.js';
import PointGrey from '../../entities/enemies/PointGrey.js';

export default class ForestMap extends Level {

    constructor() {
        super('Forest', '../../assets/background_map/map1_background.png');
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
    }
}
