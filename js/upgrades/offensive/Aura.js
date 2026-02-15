import Upgrade from '../../entities/base/Upgrade.js';
import AuraDamage from '../../behaviors/AuraDamage.js';

export default class Aura extends Upgrade {
    static radiusByLevel = [60, 80, 100, 120, 140];
    static dpsByLevel = [3, 4.5, 6, 7.5, 9];

    constructor() {
        super({
            id: 'aura',
            name: 'Aura',
            maxLevel: 5
        });

        this.auraBehavior = null;
    }

    apply(player) {
        if (this.level >= this.maxLevel) return;

        if (!this.auraBehavior) {
            this.auraBehavior = new AuraDamage();
            player.addBehavior(this.auraBehavior);
            player.auraBehavior = this.auraBehavior;
        }

        const nextLevel = this.level + 1;
        this.auraBehavior.radius = Aura.radiusByLevel[nextLevel - 1];
        this.auraBehavior.damagePerSecond = Aura.dpsByLevel[nextLevel - 1];

        this.level = Math.min(this.level + 1, this.maxLevel);
    }

    getDescription() {
        if (this.level >= this.maxLevel) {
            return 'Aura active (niveau max)';
        }

        const nextLevel = this.level + 1;
        const radius = Aura.radiusByLevel[nextLevel - 1];
        const dps = Aura.dpsByLevel[nextLevel - 1];

        return `Aura offensive: ${dps} degats/s, rayon ${radius}`;
    }
}
