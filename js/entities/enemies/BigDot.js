import Enemy from '../base/Enemy.js';

export default class BigDot extends Enemy {
    constructor(x, y, level) {
        super(x, y, level, {
            hp: 6,
            speed: 80,
            radius: 10,
            color: 'black',
            xpAmount: 50,
            damage: 1
        });
    }
}
