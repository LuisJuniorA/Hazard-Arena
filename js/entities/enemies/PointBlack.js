import Enemy from '../base/Enemy.js';

export default class PointBlack extends Enemy {
    constructor(x, y, level) {
        super(x, y, level, {
            hp: 1,
            speed: 80,
            radius: 4,
            color: 'black',
            xpAmount: 25,
            damage: 1
        });
    }
}
