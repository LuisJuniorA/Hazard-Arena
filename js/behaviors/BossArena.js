import Behavior from '../entities/base/Behavior.js';

export default class BossArenaBehavior extends Behavior {

    constructor(radius = 400) {
        super();
        this.radius = radius;
    }

    onAttach(entity, level) {
        this.entity = entity;
        this.level = level;

        this.activateArena();
    }

    activateArena() {
        if (!this.level) return;

        this.level.arena = {
            x: this.entity.x,
            y: this.entity.y,
            radius: this.radius,
            boss: this.entity
        };

        // Stop spawners
        this.level.behaviors.forEach(b => {
            if (b.isSpawner) b.enabled = false;
        });
    }

    update(dt) {
        if (!this.level?.arena || !this.level.player) return;

        const player = this.level.player;
        const arena = this.level.arena;

        // Si boss mort → fin d’arène
        if (this.entity.dead) {
            this.deactivateArena();
            return;
        }

        // Clamp joueur dans la zone
        const dx = player.x - arena.x;
        const dy = player.y - arena.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > arena.radius) {
            const angle = Math.atan2(dy, dx);
            player.x = arena.x + Math.cos(angle) * arena.radius;
            player.y = arena.y + Math.sin(angle) * arena.radius;
        }
    }

    deactivateArena() {
        // Réactive spawners
        this.level.behaviors.forEach(b => {
            if (b.isSpawner) b.enabled = true;
        });

        this.level.arena = null;
        this.enabled = false;
    }
}
