class AssetLoader {
    constructor() {
        this.soundManager = null;

        // Images créées directement (comme les Howl dans SoundManager)
        // Elles commencent à charger dès l'import du module
        this.images = {
            './assets/background_map/map1_background.png': this.#createImage('./assets/background_map/map1_background.png'),
            './assets/background_map/map2_background.png': this.#createImage('./assets/background_map/map2_background.png'),
            './assets/background_map/map3_background.png': this.#createImage('./assets/background_map/map3_background.png'),
            './assets/background_map/map4_background.png': this.#createImage('./assets/background_map/map4_background.png'),
        };
    }

    #createImage(src) {
        const img = new Image();
        img.src = src;
        return img;
    }

    async loadAll() {
        await this.soundManager.preloadAll();
    }

    getImage(src) {
        return this.images[src] ?? null;
    }
}

const assetLoader = new AssetLoader();
export default assetLoader;
