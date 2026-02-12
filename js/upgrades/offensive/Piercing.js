import Upgrade from '../../entities/base/Upgrade.js';

export default class Piercing extends Upgrade {

    // Niveau 1 => 1 ennemi
    // Niveau 2 => 2 ennemis
    static bonus = [1, 2];

    constructor() {
        super({
            id: 'piercing',
            name: 'Percée'
        });

        this.maxLevel = 3;
    }

    apply(player) {
        if (this.level >= this.maxLevel) return;

        // Niveau 1 & 2
        if (this.level < 2) {
            const value = Piercing.bonus[this.level];
            player.piercing = value;
        }

        // Niveau 3
        if (this.level === 2) {
            player.infinitePiercing = true;
            player.piercingDamageMultiplier = 0.9;
        }

        this.level++;
    }

    getDescription() {

        if (this.level < 2) {
            return `Traverse ${Piercing.bonus[this.level]} ennemi${Piercing.bonus[this.level] > 1 ? 's' : ''}`;
        }

        if (this.level === 2) {
            return `Traverse infiniment mais dégâts -10%`;
        }

        return `Niveau max atteint`;
    }
}
