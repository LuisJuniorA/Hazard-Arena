import Behavior from '../entities/base/Behavior.js';

export default class Clickable extends Behavior {
    update(dt) {
        const btn = this.entity;
        if (!btn) return;
        if (btn.clicked) {
            if (btn.facade) {
                btn.facade.apply(btn.upgrade.constructor);
                btn.facade.close();
                console.log(btn.upgrade.getDescription());
            }
        }
    }
}

