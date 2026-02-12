
export default class SoundManager {
    constructor() {
        this.musicVolume = 0.5;
        this.soundVolume = 0.7;

        // =========================
        // MUSIQUES
        // =========================
        this.musics = {
            mainMenu: new Howl({
                src: ['./assets/sounds/musics/Background.mp3'],
                loop: true,
                volume: this.musicVolume
            }),
            map1: new Howl({
                src: ['./assets/sounds/musics/map1.mp3'],
                loop: true,
                volume: this.musicVolume
            }),
            map2: new Howl({
                src: ['./assets/sounds/musics/map2.mp3'],
                loop: true,
                volume: this.musicVolume
            }),
            map3: new Howl({
                src: ['./assets/sounds/musics/map3.mp3'],
                loop: true,
                volume: this.musicVolume
            }),
            map4: new Howl({
                src: ['./assets/sounds/musics/map4.mp3'],
                loop: true, 
                volume: this.musicVolume 
            })
        };

        this.currentMusic = null;

        // =========================
        // SONS
        // =========================
        this.sounds = {
            win: new Howl({ src: ['./assets/sounds/musics/win.mp3'], volume: this.soundVolume }),
            shoot: [
                new Howl({ src: ['./assets/sounds/playerEvent/shooting1.mp3'], volume: this.soundVolume }),
                new Howl({ src: ['./assets/sounds/playerEvent/shooting2.mp3'], volume: this.soundVolume }),
                new Howl({ src: ['./assets/sounds/playerEvent/shooting3.mp3'], volume: this.soundVolume })
            ],
            xpGain: [
                new Howl({ src: ['./assets/sounds/playerEvent/xpGain1.mp3'], volume: this.soundVolume }),
                new Howl({ src: ['./assets/sounds/playerEvent/xpGain2.mp3'], volume: this.soundVolume }),
                new Howl({ src: ['./assets/sounds/playerEvent/xpGain3.mp3'], volume: this.soundVolume })
            ],
            levelUp: new Howl({ src: ['./assets/sounds/playerEvent/levelUp.mp3'], volume: this.soundVolume }),
            hit: [
                new Howl({ src: ['./assets/sounds/playerEvent/hit1.mp3'], volume: this.soundVolume }),
                new Howl({ src: ['./assets/sounds/playerEvent/hit2.mp3'], volume: this.soundVolume })
            ],
            death: new Howl({ src: ['./assets/sounds/playerEvent/death.mp3'], volume: this.soundVolume }),
            clickCombo: new Howl({ src: ['./assets/sounds/mouseEvent/chooseCombo.mp3'], volume: this.soundVolume }),
            clickUpgrade: new Howl({ src: ['./assets/sounds/mouseEvent/chooseUpgrade.mp3'], volume: this.soundVolume }),
            clickLoadMap: new Howl({ src: ['./assets/sounds/mouseEvent/loadMap.mp3'], volume: this.soundVolume })
        };
    }

    // =========================
    // PRÉCHARGEMENT
    // =========================
    async preloadAll() {
        const promises = [];

        // musiques
        Object.values(this.musics).forEach(howl => {
            promises.push(new Promise(resolve => {
                howl.once('load', resolve);
                console.log(`Chargement de la musique : ${howl._src}`);
            }));
        });

        // sons
        // Object.values(this.sounds).forEach(s => {
        //     if (Array.isArray(s)) {
        //         s.forEach(howl => promises.push(new Promise(resolve => howl.once('load', resolve))));
        //     } else {
        //         promises.push(new Promise(resolve => s.once('load', resolve)));
        //     }
        // });

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
    clickCombo() { this.sounds.clickCombo.play(); }
    clickUpgrade() { this.sounds.clickUpgrade.play(); }
    clickLoadMap() { this.sounds.clickLoadMap.play(); }
}
