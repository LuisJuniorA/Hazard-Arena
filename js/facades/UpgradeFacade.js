import Force from "../upgrades/offensive/Force.js"
import Vitesse from "../upgrades/mobility/Vitesse.js"
import UpgradeRoller from "../utils/UpgradeRoller.js"
import UpgradeButton from "../methods/UpgradeButton.js";

export default class UpgradeFacade {
    constructor(player) {
        this.player = player;
        this.allUpgrades = [Force, Vitesse];

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

        this.buttons = rolled.map((UpgradeClass, i) => {
            const upgradeInstance = new UpgradeClass();
            return new UpgradeButton(
                upgradeInstance,
                i,           // index
                rolled.length, // total
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
        for (const btn of this.buttons) btn.render(ctx, canvas);
    }
}
