export default class AssetLoader {
    constructor(soundManager) {
        this.soundManager = soundManager;
    }

    async loadAll() {
        await Promise.all([
            this.soundManager.preloadAll(),
            this.preloadImages([
                './assets/background_map/map1_background.png',
                './assets/background_map/map2_background.png',
                './assets/background_map/map3_background.png',
                './assets/background_map/map4_background.png',
            ])
        ]);
    }

    preloadImages(srcs) {
        return Promise.all(srcs.map(src => new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
        })));
    }
}
