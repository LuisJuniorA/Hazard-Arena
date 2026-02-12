import Level from '../base/Level.js';
import EnemySpawner from '../../behaviors/EnemySpawner.js';
import PointGrey from '../../entities/enemies/PointGrey.js';
import BigDot from '../../entities/enemies/BigDot.js';

export default class SnowMap extends Level {

    constructor() {
        super('Snow', '../../assets/background_map/map3_background.png');
    }

    initSpawners() {
        this.addBehavior(new EnemySpawner(
            PointGrey,
            { duration: 800, spawnInterval: 1.5, spawnIncrementInterval: 4 }
        ));

        setTimeout(() => {
            this.addBehavior(new EnemySpawner(
                BigDot,
                { duration: 600, spawnInterval: 3, spawnIncrementInterval: 8 }
            ));
        }, 3 * 60 * 1000);
    }
}
