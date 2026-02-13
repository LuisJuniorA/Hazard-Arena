import Upgrade from '../../entities/base/Upgrade.js';

export default class Dash extends Upgrade {
    static bonus = [10.0, 5.0, 2.5]; // cooldown en secondes entre les dash (par niveau)

    constructor() {
        super({
            id: 'dash',
            name: 'Dash'
        });
    }

    apply(player) {
        if (this.level >= this.maxLevel) return;
        const cooldown = Dash.bonus[this.level];
        player.canDash = true;
        player.dashCooldown = cooldown;
        player.dashTimer = 0; //pêt imédiatement à chaque niveau
        this.level++;
    }

    getDescription() {
        if (this.level < this.maxLevel) {
            return `Dash (Espace) — Cooldown: ${Dash.bonus[this.level]}s`;
        }
        return `Niveau max atteint`;
    }

    getCooldownInfo(player) {
        if (!player.canDash) return null;
        return {
            name: 'DASH',
            key: 'ESPACE',
            cooldown: player.dashCooldown,
            timer: player.dashTimer,
            active: player.isDashing
        };
    }
}
