import Entity from '../base/Entity.js';
import PlayerAttack from '../../behaviors/PlayerAttack.js';

export default class Player extends Entity {
    constructor(x, y, level) {
        super(x, y, 10); // radius 10
        this.levelRef = level;
        this.hp = 300;
        this.speed = 5;

        this.attackDamage = 1;
        this.attackSpeed = 1;
        this.baseProjectileNumber = 1;

        this.level = level;
        this.experience = 0;
        this.levelNumber = 0;
        this.experienceGrabRange = 10;

        this.upgrades = [];
        this.behaviors = [];
        this.addBehavior(new PlayerAttack());
    }

    grabXp(xpAmount) {
        this.experience += xpAmount * this.experienceRate;

        while (this.experience >= 100) {
            this.experience -= 100;
            this.levelUp();
        }
    }

    addUpgrade(upgrade) {
        const existing = this.upgrades.find(u => u.id === upgrade.id);

        if (existing) {
            if (!existing.canUpgrade(this)) return false;
            existing.apply(this);
        } else {
            upgrade.apply(this);
            this.upgrades.push(upgrade);
        }

        return true;
    }


    move(dx, dy) {
        this.x += dx * this.speed * Math.SQRT1_2;
        this.y += dy * this.speed * Math.SQRT1_2;
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) this.hp = 0;
    }

    render(ctx, canvas) {
        ctx.save();
        ctx.fillStyle = 'red';
        ctx.fillRect(canvas.width / 2 - 10, canvas.height / 2 - 10, 20, 20);
        ctx.restore();
    }
}
