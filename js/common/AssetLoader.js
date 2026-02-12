export default class AssetLoader {
    constructor(soundManager) {
        this.soundManager = soundManager;
    }

    async loadAll() {
        await this.soundManager.preloadAll();
    }
}
