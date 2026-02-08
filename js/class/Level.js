export default class Level {
    constructor(name, backgroundSrc, entities = []) {
        this.name = name;
        this.backgroundImage = new Image();
        this.backgroundImage.src = backgroundSrc;
        this.entities = entities;
    }

    addEntity(entity) {
        this.entities.push(entity);
    }

    removeEntity(index) {
        if (index >= 0 && index < this.entities.length) {
            this.entities.splice(index, 1);
        }
    }

    getEntities() {
        return this.entities;
    }
}
