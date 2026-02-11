import Upgrade from '../../entities/base/Upgrade.js';

export default class Force extends Upgrade {
    constructor() {
        super({
            id: 'vitesse',
            name: 'Vitesse'
        });
    }

    apply(player) {
        super.apply(player);

        const bonus = [0.05, 0.10, 0.15][this.level - 1];
        player.speed *= (1 + bonus);
    }

    getDescription() {
        const nextLevel = this.level + 1;

        if (nextLevel <= 3) {
            return `Augmente la vitesse de ${nextLevel * 5}%`;
        }

        return `Fusion : TODO`;
    }
}
