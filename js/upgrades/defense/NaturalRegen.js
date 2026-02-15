import Upgrade from '../../entities/base/Upgrade.js';

export default class NaturalRegen extends Upgrade {
    static bonus = [1, 2, 4];

    constructor() {
        super({
            id: 'NaturalRegen',
            name: 'Health Regen'
        });
    }

    apply(player) {
        if (this.level >= this.maxLevel) return;

        const bonus = NaturalRegen.bonus[this.level]; // bonus du PROCHAIN niveau
        player.healthRegenAmount = bonus;

        this.level++;
    }

    getDescription() {
        if (this.level < this.maxLevel) {
                return `Restaure ${NaturalRegen.bonus[this.level]} points de vie toute les 10 secondes.`;
        }

        return `Niveau max atteint`;
    }
}
