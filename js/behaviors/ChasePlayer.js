export default class ChasePlayer {
    update(dt) {
        const e = this.entity;
        const p = e.level?.player;
        if (!p) return;

        const dx = p.x - e.x;
        const dy = p.y - e.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) return;

        e.x += (dx / dist) * e.speed * (dt ?? 1);
        e.y += (dy / dist) * e.speed * (dt ?? 1);
    }
}
