import Character from './Character.js';
import XP from '../player/XP.js';
import ChasePlayer from '../../behaviors/ChasePlayer.js'
import ContactDamage from '../../behaviors/ContactDamage.js'
import AvoidOtherEnemies from '../../behaviors/AvoidOtherEnemies.js'
import soundManager from '../../common/soundInstance.js';

export default class Enemy extends Character {
    constructor(x, y, level, config = {}) {
        super(x, y, level, config);
        this.xpAmount = config.xpAmount ?? 1;
        this.addBehavior(new ChasePlayer());
        this.addBehavior(new ContactDamage(config.damage ?? 1));
        this.addBehavior(new AvoidOtherEnemies());
    }

    takeDamage(amount) {
        super.takeDamage(amount);

        if (this.dead && this.level) {
            const xp = new XP(this.x, this.y, this.level, this.xpAmount);
            this.level.addXP(xp);
        }
        soundManager.ennemyHit();
        
    }

    render(ctx, canvas) {
        ctx.save();
        if (!this.level || !this.level.player) return;
        const player = this.level.player;
        const screenX = this.x - player.x + canvas.width / 2;
        const screenY = this.y - player.y + canvas.height / 2;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
