import Upgrade from '../../entities/base/Upgrade.js';

export default class NaturalRegen extends Upgrade {
    static bonus = [1, 2, 4];

    constructor() {
        super({
            id: 'NaturalRegen',
            name: 'Health Regeneration'
        });
    }

    apply(player) {
        if (this.level >= this.maxLevel) return;

        const bonus = NaturalRegen.bonus[this.level]; // bonus du PROCHAIN niveau
        let healed = bonus+player.hp;
        if(healed > player.maxHealth) healed = player.maxHealth;
        player.hp = healed;

        this.level++;
    }

    getDescription() {
        return `Restaure ${NaturalRegen.bonus[this.level]} points de vie instantanément`;
    }
}
