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
}
