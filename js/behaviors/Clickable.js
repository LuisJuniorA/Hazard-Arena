import Behavior from '../entities/base/Behavior.js';

export default class Clickable extends Behavior {
    update(dt) {
        const btn = this.entity;
        if (!btn || !btn.level?.input) return;

        const { mouseX, mouseY, clicked } = btn.level.input;
        if (clicked && btn.isHovered(mouseX, mouseY)) {
            if (btn.facade) {
                btn.facade.apply(btn.upgrade.constructor);
                btn.facade.close();
            }
        }
    }
}

