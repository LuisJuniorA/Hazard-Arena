import Upgrade from '../../entities/base/Upgrade.js';

export default class Force extends Upgrade {
    static bonus = [0.5, 1, 2];

    constructor() {
        super({
            id: 'force',
            name: 'Force'
        });
    }

    apply(player) {
        if (this.level >= this.maxLevel) return;

        const bonus = Force.bonus[this.level]; // bonus du PROCHAIN niveau

        player.attackDamage = player.baseDamage * (1 + bonus);

        this.level++;
    }

    getDescription() {
        if (this.level < this.maxLevel) {
            return `Augmente les dégats de ${Force.bonus[this.level] * 100}%`;
        }

        return `Niveau max atteint`;
    }
}
