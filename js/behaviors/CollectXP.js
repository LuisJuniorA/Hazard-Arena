export default class CollectXP {
    /**
     * @param {Array} xpEntities - tableau global des XP à ramasser
     */
    constructor(xpEntities) {
        this.xpEntities = xpEntities;
    }

    update(dt) {
        const player = this.entity;
        if (!player) return;

        for (let i = this.xpEntities.length - 1; i >= 0; i--) {
            const xp = this.xpEntities[i];
            if (xp.dead) continue;

            const dist = Math.hypot(player.x - xp.x, player.y - xp.y);
            if (dist <= xp.radius) {
                player.grabXp(xp.amount);
                xp.dead = true;
            }
        }
    }
}
