export default class HUDManager {
    constructor() {
        this.elements = [];
        this.active = true;
    }

    add(element) {
        if (!element) return;
        this.elements.push(element);
    }

    remove(element) {
        const index = this.elements.indexOf(element);
        if (index !== -1) {
            this.elements.splice(index, 1);
        }
    }

    clear() {
        this.elements.length = 0;
    }

    update(dt) {
        if (!this.active) return;

        for (const el of this.elements) {
            el.update?.(dt);
        }
    }

    render(ctx, canvas) {
        if (!this.active) return;

        ctx.save();
        for (const el of this.elements) {
            el.render?.(ctx, canvas);
        }
        ctx.restore();
    }

    setActive(state) {
        this.active = state;
    }
}
