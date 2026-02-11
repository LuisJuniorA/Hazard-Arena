export default class UpgradeRoller {
    static roll(upgrades, count = 3) {
        const shuffled = [...upgrades].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }
}
