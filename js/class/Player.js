import PlayerAttack from "../behaviors/PlayerAttack.js";

export default class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 5;

        this.hp = 300; // corresponds to 3 bars of health, each bar representing 100 hp
        this.healingRate = 0;

        this.attackDamage = 0.5;
        this.attackRange = 50; // in pixels
        this.attackSpeed = 1; // attacks per second
        this.baseProjectileNumber = 1; // number of projectiles per attack

        this.level = 0;
        this.experience = 0; // out of 100
        this.experienceRate = 0.5; // experience multiplier
        this.experienceGrabRange = 30; // in pixels
        this.behaviors = []

        this.addBehavior(new PlayerAttack());
    }

    move(dx, dy) {
        this.x += dx * this.speed * Math.SQRT1_2;
        this.y += dy * this.speed * Math.SQRT1_2;
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) {
            this.hp = 0;
        }
        //todo add death handling
    }

    heal() {
        if (this.healingRate > 0) {
            this.hp += this.healingRate;
            if (this.hp > 300) {
                this.hp = 300;
            }
        }//todo maybe add a shield system for overhealing
    }

    canGrabXp(xpos, ypos) {
        if (Math.hypot(this.x - xpos, this.y - ypos) < this.experienceGrabRange) {
            return true;
        }
        return false;
    }

    grabXp(amount) {
        this.experience += amount * this.experienceRate;
        if (this.experience >= 100) {
            this.experience -= 100;
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        //todo add level up benefits
    }

    upgrade(type) {//todo change to the good format
        switch (type) {
            case 'attackDamage':
                this.attackDamage += 0.5;
                break;
            default:
                break;
        }
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

    update(dt){
        for (const b of this.behaviors) b.update(dt);
    }

    addBehavior(behavior) {
        behavior.entity = this;
        this.behaviors.push(behavior);
    }
}