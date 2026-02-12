export default class Sound {
    constructor(src, volume = 1, loop = false) {
        this.audio = new Audio(src);
        this.audio.volume = volume;
        this.audio.loop = loop;
        this.audioLength = this.audio.duration;
        this.isPlaying = false;
    }

    preload() {
        return new Promise((resolve, reject) => {
            this.audio.addEventListener("canplaythrough", resolve, { once: true });
            this.audio.addEventListener("error", reject, { once: true });
            this.audio.load();
        });
    }

    play() {
        if (this.isPlaying) {
            this.audio.currentTime = 0;
        } else {
            this.audio.play().catch(err => console.log(err));;
            this.isPlaying = true;
            this.audio.onended = () => {
                this.isPlaying = false;
            };
        }
        console.log(`Playing sound: ${this.audio.src}`);
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
    }

    setVolume(volume) {
        this.audio.volume = volume;
    }
}