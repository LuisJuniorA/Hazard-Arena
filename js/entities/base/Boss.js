import Enemy from './Enemy.js';
import BossArenaBehavior from '../../behaviors/BossArenaBehavior.js';

export default class Boss extends Enemy {
    constructor(x, y, level) {
        super(x, y, level, {
            hp: 500,
            damage: 10,
            speed: 80,
            radius: 40,
            xpAmount: 50
        });

        this.color = "#8e44ad"; // violet boss
        this.isBoss = true;

        this.addBehavior(new BossArenaBehavior());
    }

    takeDamage(amount) {
        super.takeDamage(amount);

        if (this.dead) {
            this.onDeath();
        }
    }

    onDeath() {
        console.log("Boss defeated!");
        // nettoyage spécial si nécessaire
    }
}
