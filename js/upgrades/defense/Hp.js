import Upgrade from '../../entities/base/Upgrade.js';

export default class Hp extends Upgrade {
    static bonus = [5, 5, 5];

    constructor() {
        super({
            id: 'HP',
            name: 'Heath Points'
        });
    }

    apply(player) {
        if (this.level >= this.maxLevel) return;

        const bonus = Hp.bonus[this.level]; // bonus du PROCHAIN niveau

        player.maxHealth += bonus;

        this.level++;
    }

    getDescription() {
        if (this.level < this.maxLevel) {
            return `Augmente les points de vie maximum de ${Hp.bonus[this.level]}`;
        }

        return `Niveau max atteint`;
    }
}
