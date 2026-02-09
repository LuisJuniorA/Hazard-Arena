export default class Behavior {
    constructor() {
        this.entity = null;
        this.level = null;
        this.enabled = true;
    }

    onAttach(entity, level = null) {
        this.entity = entity;
        this.level = level;
    }

    update(dt) {
        
    }

    onDetach() {}
}
