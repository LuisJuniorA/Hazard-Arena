import Upgrade from '../../entities/base/Upgrade.js';
import FireballBehavior from '../../behaviors/FireballBehavior.js';

export default class FireballUpgrade extends Upgrade {
    constructor() {
        super({
            id: 'fireball',
            name: 'Boule de Feu',
            maxLevel: 5
        });

        // On garde une référence directe pour ne pas rechercher
        this.fireballBehavior = null;
    }

    apply(player) {
        if (!this.fireballBehavior) {
            // création du behavior au level 1
            this.fireballBehavior = new FireballBehavior();
            player.addBehavior(this.fireballBehavior);
        }

        // calcul des bonus selon le niveau actuel (avant incrément)
        const nextLevel = this.level + 1;
        this.fireballBehavior.baseDamage = 5 + nextLevel * 2;  // dégâts
        this.fireballBehavior.radius = 8 + nextLevel;          // rayon explosion
        this.fireballBehavior.cooldown = 1 / ((player.attackSpeed || 1) + nextLevel * 0.1);

        // augmente le niveau de l'upgrade
        this.level = Math.min(this.level + 1, this.maxLevel);
    }

    getDescription() {
        if (this.level >= this.maxLevel) {
            return `Tire une boule de feu explosive (max level)`;
        }

        const nextLevel = this.level + 1;
        const nextDamage = 5 + nextLevel * 2;
        const nextRadius = 8 + nextLevel;

        return `Tire une boule de feu explosive : ${nextDamage} dégâts, rayon ${nextRadius}`;
    }
}
