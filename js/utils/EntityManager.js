export default class EntityManager {
    /**
     * Supprime les entités mortes d’un tableau in-place
     * @param {Array} entities - tableau d’objets avec propriété .dead
     */
    static cleanupInPlace(entities) {
        for (let i = entities.length - 1; i >= 0; i--) {
            if (entities[i].dead) entities.splice(i, 1);
        }
    }

    static getClosestEnemy(player, enemies) {
        let closest = null;
        let closestDist = Infinity;

        for (const e of enemies) {
            if (e.dead) continue;

            const dx = e.x - player.x;
            const dy = e.y - player.y;
            const dist = dx * dx + dy * dy;

            if (dist < closestDist) {
                closestDist = dist;
                closest = e;
            }
        }

        return closest;
    }

    static getEnemyVector(player, target){
        const dx = target.x - player.x;
        const dy = target.y - player.y;
        const dist = Math.hypot(dx, dy) || 0.001;

        const vx = dx / dist;
        const vy = dy / dist;
        return {vx, vy};
    }
}
