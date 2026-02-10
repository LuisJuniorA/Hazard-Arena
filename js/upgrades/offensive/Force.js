import Upgrade from '../entities/base/Upgrade.js';

export default class Force extends Upgrade {
    constructor() {
        super({
            id: 'force',
            name: 'Force'
        });
    }

    apply(player) {
        super.apply(player);

        const bonus = [0.05, 0.10, 0.15][this.level - 1];
        player.attackDamage *= (1 + bonus);
    }

    getDescription() {
        const nextLevel = this.level + 1;

        if (nextLevel <= 3) {
            return `Augmente les dégâts de ${nextLevel * 5}%`;
        }

        return `Fusion : Execute les ennemis sous 10% PV`;
    }
}
