import Enemy from './Enemy.js';
import BossArena from '../../behaviors/BossArena.js';

export default class Boss extends Enemy {
    constructor(x, y, level) {
        super(x, y, level, {
            hp: 500,
            damage: 10,
            speed: 80,
            radius: 40,
            xpAmount: 50
        });

        this.color = "#8e44ad";
        this.isBoss = true;

        this._deathHandled = false;

        this.addBehavior(new BossArena());
    }

    takeDamage(amount) {
        super.takeDamage(amount);

        if (this.dead) {
            this._deathHandled = true;
            this.dead = false;
            this.onDeath();
        }
    }

    onDeath() {
        console.log("Boss defeated!");
        // ici tu peux déclencher loot, son, etc.
    }
}
