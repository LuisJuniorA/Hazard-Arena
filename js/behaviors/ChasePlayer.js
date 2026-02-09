import Behavior from '../entities/base/Behavior.js';

export default class ChasePlayer extends Behavior {
    update(dt) {
        if (dt == null) return;

        const e = this.entity;
        const p = e?.level?.player;
        if (!e || !p) return;

        const dx = p.x - e.x;
        const dy = p.y - e.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.001) return;

        const step = e.speed * dt;
        const nx = dx / dist;
        const ny = dy / dist;

        e.x += nx * step;
        e.y += ny * step;
    }
}
