import Force from "../upgrades/offensive/Force.js"
import Vitesse from "../upgrades/mobility/Vitesse.js"
import Dash from "../upgrades/mobility/Dash.js"
import AttackSpeed from "../upgrades/offensive/AttackSpeed.js";
import BurstAmount from "../upgrades/offensive/BurstAmount.js";
import Piercing from "../upgrades/offensive/Piercing.js";
import FireballUpgrade from "../upgrades/offensive/FireballUpgrade.js";
import UpgradeRoller from "../utils/UpgradeRoller.js"
import soundManager from "../common/soundInstance.js";
import UpgradeButton from "../methods/hud/UpgradeButton.js";

export default class UpgradeFacade {
    constructor(player) {
        this.player = player;
        this.allUpgrades = [Force, Vitesse, Dash, AttackSpeed, BurstAmount, Piercing, FireballUpgrade];

        this.active = false;
        this.buttons = [];
    }

    getAvailableUpgrades() {
        return this.allUpgrades.filter(UpgradeClass => {
            const id = new UpgradeClass().id;
            const existing = this.player.upgrades?.find(u => u.id === id);
            return !existing || existing.level < existing.maxLevel;
        });
    }

    roll(count = 3) {
        const available = this.getAvailableUpgrades();
        return UpgradeRoller.roll(available, count);
    }

    open() {
        const rolled = this.roll(3);
        if (!rolled.length) return;

        this.buttons = rolled.map((UpgradeClass, i) => {
            const id = UpgradeClass.prototype.id || new UpgradeClass().id;
            const existing = this.player.upgrades.find(u => u.id === id);
            const upgradeInstance = existing ?? new UpgradeClass();
            return new UpgradeButton(
                upgradeInstance,
                i,
                rolled.length,
                150,
                250,
                this
            );
        });



        this.active = true;
    }

    apply(UpgradeClass) {
        const id = new UpgradeClass().id;
        const existing = this.player.upgrades.find(u => u.id === id);

        if (existing) {
            if (existing.canUpgrade(this.player)) existing.apply(this.player);
        } else {
            const upgrade = new UpgradeClass();
            upgrade.apply(this.player);
            this.player.upgrades.push(upgrade);
        }
        soundManager.clickUpgrade();
    }

    close() {
        this.active = false;
        this.buttons = [];
    }

    update(dt) {
        if (!this.active) return;
        for (const btn of this.buttons) btn.update(dt);
    }

    render(ctx, canvas) {
        if (!this.active) return;
        ctx.save();
        for (const btn of this.buttons) btn.render(ctx, canvas);
        ctx.restore();
    }
}
