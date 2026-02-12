import Enemy from '../base/Enemy.js';

export default class PointGrey extends Enemy {
    constructor(x, y, level) {
        super(x, y, level, {
            hp: 3,
            speed: 80,
            radius: 8,
            color: 'grey',
            xpAmount: 10,
            damage: 1
        });
    }
}
