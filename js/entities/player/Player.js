import Entity from '../base/Entity.js';
import PlayerAttack from '../../behaviors/PlayerAttack.js';
import UpgradeFacade from '../../facades/UpgradeFacade.js';

export default class Player extends Entity {
    constructor(x, y, level) {
        super(x, y, 10); // radius 10
        this.levelRef = level;
        this.hp = 300;
        this.baseSpeed = 5;
        this.baseDamage = 1;
        this.baseAttackSpeed = 1;
        this.burstCount = 3;

        this.speed = this.baseSpeed;
        this.attackDamage = this.baseDamage;
        this.attackSpeed = this.baseAttackSpeed;
        this.baseProjectileNumber = 1;
        this.piercing = 0;
        this.infinitePiercing = false;
        this.piercingDamageMultiplier = 1;
        this.piercingExecute = false;


        this.level = level;
        this.experience = 0;
        this.levelNumber = 0;
        this.experienceRate = 1;
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

    levelUp() {
        this.levelNumber++;
        if (!this.levelRef.upgradeFacade) {
            this.levelRef.upgradeFacade = new UpgradeFacade(this);
        }
        this.levelRef.upgradeFacade.open(); // active l'écran d'upgrade
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
