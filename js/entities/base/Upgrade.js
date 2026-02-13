export default class Upgrade {
    constructor({ id, name, maxLevel = 3 }) {
        this.id = id;
        this.name = name;
        this.level = 0;
        this.maxLevel = maxLevel;
    }

    canUpgrade(player) {
        return this.level < this.maxLevel;
    }

    apply(player) {
        this.level++;
    }

    getDescription() {
        return '';
    }

    getCooldownInfo(player) {
        return null;
    }

    remove(entity) { }
}
