import Upgrade from '../../entities/base/Upgrade.js';

export default class AttackSpeed extends Upgrade {
    static bonus = [0.5, 1, 2];

    constructor() {
        super({
            id: 'attack_speed',
            name: 'Attack Speed'
        });
    }

    apply(player) {
        if (this.level >= this.maxLevel) return;

        const bonus = AttackSpeed.bonus[this.level]; // bonus du PROCHAIN niveau

        player.attackSpeed = player.baseAttackSpeed * (1 + bonus);

        this.level++;
    }

    getDescription() {
        console.log(this.level)
        if (this.level < this.maxLevel) {
            return `Augmente la vitesse d'attaque de ${AttackSpeed.bonus[this.level] * 100}%`;
        }

        return `Niveau max atteint`;
    }
}
