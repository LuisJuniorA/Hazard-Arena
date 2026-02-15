import Level from '../base/Level.js';
import EnemySpawner from '../../behaviors/EnemySpawner.js';
import PointBlack from '../../entities/enemies/PointBlack.js';
import PointGrey from '../../entities/enemies/PointGrey.js';
import BigDot from '../../entities/enemies/BigDot.js';

export default class ComplexMap extends Level {

    constructor() {
        super('Complex', './assets/background_map/map4_background.png');
        this.player.experienceRate = 2;
    }

    initSpawners() {
        this.addBehavior(new EnemySpawner(
            PointBlack,
            { duration: 500, spawnInterval: 1, spawnIncrementInterval: 5 }
        ));

        this.addBehavior(new EnemySpawner(
            PointGrey,
            { duration: 700, spawnInterval: 1.2, spawnIncrementInterval: 6 }
        ));

        setTimeout(() => {
            this.addBehavior(new EnemySpawner(
                BigDot,
                { duration: 900, spawnInterval: 2, spawnIncrementInterval: 10 }
            ));
        }, 2 * 60 * 1000);
    }
}
