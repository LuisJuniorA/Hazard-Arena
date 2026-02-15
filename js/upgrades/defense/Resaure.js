import Upgrade from '../../entities/base/Upgrade.js';

export default class Restaure extends Upgrade {
    static bonus = [5];

    constructor() {
        super({
            id: 'HP',
            name: 'Heath Points'
        });
    }

    apply(player) {
        if (this.level >= this.maxLevel) return;

        const bonus = Restaure.bonus[0]; // bonus du PROCHAIN niveau

        player.curr += bonus;

        this.level++;
    }

    getDescription() {
        if (this.level < this.maxLevel) {
            return `Augmente les points de vie maximum de ${Restaure.bonus[0]}`;
        }

        return `Niveau max atteint`;
    }
}
