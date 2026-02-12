import Upgrade from '../../entities/base/Upgrade.js';

export default class BurstAmount extends Upgrade {
    static bonus = [1, 3, 5];

    constructor() {
        super({
            id: 'burst_amount',
            name: 'Burst Amount'
        });
    }

    apply(player) {
        if (this.level >= this.maxLevel) return;

        const bonus = BurstAmount.bonus[this.level]; // bonus du PROCHAIN niveau

        player.burstCount = player.burstCount + bonus;

        this.level++;
    }

    getDescription() {
        if (this.level < this.maxLevel) {
            return `Augmente le nombre de tirs de ${BurstAmount.bonus[this.level]}`;
        }

        return `Niveau max atteint`;
    }
}
