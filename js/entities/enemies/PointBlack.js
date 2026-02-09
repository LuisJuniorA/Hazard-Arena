import Enemy from '../base/Enemy.js';
import ChasePlayer from '../../behaviors/ChasePlayer.js';
import ContactDamage from '../../behaviors/ContactDamage.js';
import AvoidOtherEnemies from '../../behaviors/AvoidOtherEnemies.js';

export default class PointBlack extends Enemy {
    constructor(x, y, level) {
        super(x, y, level, {
            hp: 1,
            speed: 80,
            radius: 4,
            color: 'black',
            xpAmount: 1
        });

        this.addBehavior(new ChasePlayer());
        this.addBehavior(new ContactDamage(1));
        this.addBehavior(new AvoidOtherEnemies());
    }
}
