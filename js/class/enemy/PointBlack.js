import Enemy from '../Enemy.js';
import ChasePlayer from '../../behaviors/ChasePlayer.js';
import ContactDamage from '../../behaviors/ContactDamage.js';
import AvoidOtherEnemies from '../../behaviors/AvoidOtherEnemies.js';

export default class PointBlack extends Enemy {
    constructor(x, y, player) {
        super(x, y, player, {
            hp: 1,
            speed: 80,
            radius: 6,
            color: 'black'
        });

        this.addBehavior(new ChasePlayer());
        this.addBehavior(new ContactDamage());
        this.addBehavior(new AvoidOtherEnemies());
    }
}
