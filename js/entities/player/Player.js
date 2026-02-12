import Entity from '../base/Entity.js';
import PlayerAttack from '../../behaviors/PlayerAttack.js';
import UpgradeFacade from '../../facades/UpgradeFacade.js';
import EntityManager from '../../utils/EntityManager.js';

export default class Player extends Entity {
    constructor(x, y, level) {
        super(x, y, 10); // radius 10
        this.levelRef = level;
        this.hp = 300;
        this.baseSpeed = 5;
        this.baseDamage = 1;
        this.baseAttackSpeed = 1;
        this.burstCount = 3;
        this.lastMoveX = 1; // par défaut vers la droite
        this.lastMoveY = 0;


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
        this.experienceGrabRange = 50;

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
        if (dx !== 0 || dy !== 0) {
            this.lastMoveX = dx;
            this.lastMoveY = dy;
        }

        const factor = Math.SQRT1_2; // normalisation pour diagonales
        this.x += dx * this.speed * factor;
        this.y += dy * this.speed * factor;
    }


    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) this.hp = 0;
    }

    render(ctx, canvas) {
        const x = canvas.width / 2;
        const y = canvas.height / 2;
        const r = 20;

        ctx.save();

        // Glow
        const gradient = ctx.createRadialGradient(x, y, r / 2, x, y, r);
        gradient.addColorStop(0, 'rgba(255, 100, 0, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        // Corps
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(x, y, r * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Calculer l'angle selon la dernière direction
        const angle = Math.atan2(this.lastMoveY, this.lastMoveX);

        // Arme : rotation vers la direction de mouvement
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.strokeStyle = '#8B4513'; // couleur bois
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(r * 0.3, 0);
        ctx.lineTo(r * 1.2, 0);
        ctx.stroke();

        // Petite flamme au bout
        const flameGradient = ctx.createRadialGradient(r * 1.2, 0, 0, r * 1.2, 0, r * 0.3);
        flameGradient.addColorStop(0, 'rgba(255, 200, 0, 0.9)');
        flameGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        ctx.fillStyle = flameGradient;
        ctx.beginPath();
        ctx.arc(r * 1.2, 0, r * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }







}
