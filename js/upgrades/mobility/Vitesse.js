import Upgrade from '../../entities/base/Upgrade.js';

export default class Vitesse extends Upgrade {
    static bonus = [0.05, 0.10, 0.15];

    constructor() {
        super({
            id: 'vitesse',
            name: 'Vitesse'
        });
    }

    apply(player) {
        if (this.level >= this.maxLevel) return;

        const bonus = Vitesse.bonus[this.level]; // bonus du PROCHAIN niveau

        player.speed = player.baseSpeed * (1 + bonus);

        this.level++;
    }

    getDescription() {
        if (this.level < this.maxLevel) {
            return `Augmente la vitesse de ${Vitesse.bonus[this.level] * 100}%`;
        }

        return `Niveau max atteint`;
    }
}
