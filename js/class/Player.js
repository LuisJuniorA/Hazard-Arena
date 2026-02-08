import PlayerAttack from "../behaviors/PlayerAttack.js";

export default class Player {
    constructor(x, y, level) {
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.levelRef = level; // référence au level courant

        this.hp = 300; // 3 barres
        this.healingRate = 0;

        this.attackDamage = 1;
        this.attackRange = 50;
        this.attackSpeed = 1; // attaques par seconde
        this.baseProjectileNumber = 1;

        this.maxLevel = 100;
        this.level = 0;
        this.experience = 0;
        this.experienceRate = 0.5;
        this.experienceGrabRange = 30;

        this.behaviors = [];
        this.addBehavior(new PlayerAttack());
    }

    move(dx, dy) {
        this.x += dx * this.speed * Math.SQRT1_2;
        this.y += dy * this.speed * Math.SQRT1_2;
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
        // todo: gérer la mort
    }

    heal() {
        if (this.healingRate > 0) {
            this.hp += this.healingRate;
            if (this.hp > 300) this.hp = 300;
        }
    }

    canGrabXp(x, y) {
        return Math.hypot(this.x - x, this.y - y) < this.experienceGrabRange;
    }

    grabXp(xpAmount) {
        this.experience += xpAmount * this.experienceRate;

        while (this.experience >= 100) {
            this.experience -= 100;
            this.levelUp();
        }
    }

    levelUp() {
        if (this.level >= this.maxLevel) {
            this.experience = 0; 
            return;
        }
        
        this.level++;
        console.log(`Level up ! Nouveau niveau : ${this.level}`);        // todo: effets du level up (vitesse, dégâts, etc.)
    }

    upgrade(type) {
        switch (type) {
            case 'attackDamage':
                this.attackDamage += 0.5;
                break;
            default:
                break;
        }
    }

    update(dt) {
        // update comportements
        for (const b of this.behaviors) b.update(dt, this.levelRef);
    }

    render(ctx, canvas) {
        ctx.fillStyle = 'red';
        ctx.fillRect(
            canvas.width / 2 - 10,
            canvas.height / 2 - 10,
            20,
            20
        );
    }

    addBehavior(behavior) {
        behavior.entity = this;
        this.behaviors.push(behavior);
    }
}
