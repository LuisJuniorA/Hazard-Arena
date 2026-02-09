import Enemy from '../base/Enemy.js';
import ChasePlayer from '../../behaviors/ChasePlayer.js';
import ContactDamage from '../../behaviors/ContactDamage.js';
import AvoidOtherEnemies from '../../behaviors/AvoidOtherEnemies.js';

export default class PointGrey extends Enemy {
    constructor(x, y, level) {
        super(x, y, level, {
            hp: 3,
            speed: 80,
            radius: 8,
            color: 'grey',
            xpAmount: 10
        });

        this.addBehavior(new ChasePlayer());
        this.addBehavior(new ContactDamage(1));
        this.addBehavior(new AvoidOtherEnemies());
    }
}
