import Upgrade from '../../entities/base/Upgrade.js';

export default class Restaure extends Upgrade {
    static bonus = [5];

    constructor() {
        super({
            id: 'Restaure',
            name: 'HEAL'
        });
    }

    apply(player) {
        if (this.level >= this.maxLevel) return;

        const bonus = Restaure.bonus[0]; // bonus du PROCHAIN niveau
        let healed = bonus+player.hp;
        if(healed > player.maxHealth) healed = player.maxHealth;
        player.hp = healed;        

        this.level++;
    }

    getDescription() {
        if (this.level < this.maxLevel) {
            return `Restaure ${Restaure.bonus[0]} points de vie`;
        }

        return `Niveau max atteint`;
    }
}
