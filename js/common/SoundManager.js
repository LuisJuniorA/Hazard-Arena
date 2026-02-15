
export default class SoundManager {
    constructor() {
        this.musicVolume = 0.4;
        this.soundVolume = 0.2;

        // =========================
        // MUSIQUES
        // =========================
        this.musics = {
            mainMenu: new Howl({
                src: ['./assets/sounds/musics/Background.mp3'],
                loop: true,
                volume: this.musicVolume*0.5,
                html5: true
            }),
            map1: new Howl({
                src: ['./assets/sounds/musics/map1.mp3'],
                loop: true,
                volume: this.musicVolume*1.0,
                html5: true
            }),
            map2: new Howl({
                src: ['./assets/sounds/musics/map2.mp3'],
                loop: true,
                volume: this.musicVolume*0.8,
                html5: true
            }),
            map3: new Howl({
                src: ['./assets/sounds/musics/map3.mp3'],
                loop: true,
                volume: this.musicVolume*0.7,
                html5: true
            }),
            map4: new Howl({
                src: ['./assets/sounds/musics/map4.mp3'],
                loop: true, 
                volume: this.musicVolume*0.9,
                html5: true
            })
        };

        this.currentMusic = null;

        // =========================
        // SONS
        // =========================
        this.sounds = {
            win: new Howl({ src: ['./assets/sounds/musics/win.mp3'], volume: this.soundVolume*1.0 }),
            shoot: [
                new Howl({ src: ['./assets/sounds/playerEvent/shooting1.mp3'], volume: this.soundVolume*1.0 }),
                new Howl({ src: ['./assets/sounds/playerEvent/shooting2.mp3'], volume: this.soundVolume*1.0 }),
                new Howl({ src: ['./assets/sounds/playerEvent/shooting3.mp3'], volume: this.soundVolume*1.0 })
            ],
            xpGain: [
                new Howl({ src: ['./assets/sounds/playerEvent/xpGain1.mp3'], volume: this.soundVolume*1.0 }),
                new Howl({ src: ['./assets/sounds/playerEvent/xpGain2.mp3'], volume: this.soundVolume*1.0 }),
                new Howl({ src: ['./assets/sounds/playerEvent/xpGain3.mp3'], volume: this.soundVolume*1.0 })
            ],
            levelUp: new Howl({ src: ['./assets/sounds/playerEvent/levelUp.mp3'], volume: this.soundVolume*1.0 }),
            hit: [
                new Howl({ src: ['./assets/sounds/playerEvent/hit1.mp3'], volume: this.soundVolume*1.0 }),
                new Howl({ src: ['./assets/sounds/playerEvent/hit2.mp3'], volume: this.soundVolume*1.0 })
            ],
            death: new Howl({ src: ['./assets/sounds/playerEvent/death.mp3'], volume: this.soundVolume*1.0 }),
            megumin_explosion: new Howl({ src: ['./assets/sounds/playerEvent/megumin_explosion_1.mp3'], volume: this.soundVolume*1.0 }),
            tuturu: new Howl({ src: ['./assets/sounds/playerEvent/tuturu_1.mp3'], volume: this.soundVolume*1.0 }),
            playerDamage: new Howl({ src: ['./assets/sounds/playerEvent/playerDamage.mp3'], volume: this.soundVolume*1.0 }),
            clickCombo: new Howl({ src: ['./assets/sounds/mouseEvent/chooseCombo.mp3'], volume: this.soundVolume*1.0 }),
            clickUpgrade: new Howl({ src: ['./assets/sounds/mouseEvent/chooseUpgrade.mp3'], volume: this.soundVolume*1.0 }),
            clickLoadMap: new Howl({ src: ['./assets/sounds/mouseEvent/loadMap.mp3'], volume: this.soundVolume*1.0 })
        };
    }

    // =========================
    // PRÉCHARGEMENT
    // =========================
    async #loadPromise(howl) {
        return new Promise((resolve, reject) => {
            if (howl.state() === 'loaded' || howl.html5) {
                resolve();
            } else {
                howl.once('load', resolve);
                howl.once('loaderror', (id, err) => {
                    console.error(`Erreur de chargement du son : ${howl._src}`, err);reject(err); 
                }); 
                howl.load();
            }
        }); 
    }

    async preloadAll() {
        const promises = [];

        // musiques
        Object.values(this.musics).forEach(howl => {
            promises.push(new Promise(resolve => {
                this.#loadPromise(howl).then(() => {console.log(`Musique chargée : ${howl._src}`); resolve(); });
            }));
        });

        // sons
        Object.values(this.sounds).forEach(s => {
            if (Array.isArray(s)) {
                s.forEach(howl => promises.push(new Promise(resolve => {
                    this.#loadPromise(howl).then(() => {console.log(`Son chargé : ${howl._src}`); resolve(); });
                })));
            } else {
                promises.push(new Promise(resolve => {
                    this.#loadPromise(s).then(() => {console.log(`Son chargé : ${s._src}`); resolve(); });
                }));
            }
        });

        await Promise.all(promises);
        console.log('Assets audio chargés');
    }

    // =========================
    // MUSIQUES
    // =========================
    playMusic(name) {
        if (this.currentMusic) this.currentMusic.stop();
        this.currentMusic = this.musics[name];
        if (this.currentMusic) this.currentMusic.play();
    }

    stopMusic() {
        if (this.currentMusic) this.currentMusic.stop();
        this.currentMusic = null;
    }

    setMusicVolume(volume) {
        this.musicVolume = volume;
        Object.values(this.musics).forEach(m => m.volume(volume));
    }

    loadMap(mapName) {
        this.stopMusic();
        this.clickLoadMap();
        setTimeout(() => { 
            this.playMusic(mapName); 
        }, this.sounds.clickLoadMap.duration() * 400 );
    }

    // =========================
    // SONS
    // =========================
    playRandom(soundArray) {
        const index = Math.floor(Math.random() * soundArray.length);
        soundArray[index].play();
    }

    win() { this.sounds.win.play(); }
    shoot() { this.playRandom(this.sounds.shoot); }
    xpGain() { this.playRandom(this.sounds.xpGain); }
    levelUp() { this.sounds.levelUp.play(); }
    ennemyHit() { this.playRandom(this.sounds.hit); }
    death() { this.sounds.death.play(); }
    meguminExplosion() { this.sounds.megumin_explosion.play(); }
    tuturu() { this.sounds.tuturu.play(); }
    playerHit() { this.sounds.playerDamage.play(); }
    clickCombo() { this.sounds.clickCombo.play(); }
    clickUpgrade() { this.sounds.clickUpgrade.play(); }
    clickLoadMap() { this.sounds.clickLoadMap.play(); }
}
