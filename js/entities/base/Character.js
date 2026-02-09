import Entity from './Entity.js';

export default class Character extends Entity {
    constructor(x, y, level, config = {}) {
        super(x, y, config.radius ?? 8);
        this.level = level;
        this.hp = config.hp ?? 10;
        this.speed = config.speed ?? 50;
        this.damage = config.damage ?? 1;
        this.color = config.color ?? 'black';
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) this.dead = true;
    }
}
