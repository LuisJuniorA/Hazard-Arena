export default class UpgradeRoller {
    static roll(upgrades, count = 3) {
        if (upgrades.length === 0) return [];

        const shuffled = [...upgrades].sort(() => Math.random() - 0.5);
        const result = shuffled.slice(0, count);

        while (result.length < count) {
            const randomIndex = Math.floor(Math.random() * upgrades.length);
            result.push(upgrades[randomIndex]);
        }

        return result;
    }
}
