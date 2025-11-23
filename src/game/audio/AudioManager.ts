export class AudioManager {
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private currentMusic: string | null = null;

  constructor() {}

  /**
   * Register an audio file with a key
   */
  registerAudio(key: string, src: string) {
    const audio = new Audio(src);
    audio.preload = "auto";
    this.audioElements.set(key, audio);
  }

  /**
   * Play a sound effect (non-looping)
   */
  playSound(key: string, volume: number = 1) {
    const audio = this.audioElements.get(key);
    if (audio) {
      audio.currentTime = 0;
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.play().catch((error) => {
        console.warn(`Failed to play sound ${key}:`, error);
      });
    } else {
      console.warn(`Audio "${key}" not found. Make sure it's registered first.`);
    }
  }

  /**
   * Play background music (looping)
   */
  playMusic(key: string, volume: number = 0.5) {
    const audio = this.audioElements.get(key);
    if (audio) {
      // Stop current music if playing
      if (this.currentMusic && this.currentMusic !== key) {
        this.stopMusic();
      }

      this.currentMusic = key;
      audio.loop = true;
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.play().catch((error) => {
        console.warn(`Failed to play music ${key}:`, error);
      });
    } else {
      console.warn(`Music "${key}" not found. Make sure it's registered first.`);
    }
  }

  /**
   * Stop background music
   */
  stopMusic() {
    if (this.currentMusic) {
      const audio = this.audioElements.get(this.currentMusic);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      this.currentMusic = null;
    }
  }

  /**
   * Set music volume (0 to 1)
   */
  setMusicVolume(volume: number) {
    if (this.currentMusic) {
      const audio = this.audioElements.get(this.currentMusic);
      if (audio) {
        audio.volume = Math.max(0, Math.min(1, volume));
      }
    }
  }

  /**
   * Stop a sound
   */
  stopSound(key: string) {
    const audio = this.audioElements.get(key);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  /**
   * Stop all sounds
   */
  stopAllSounds() {
    this.audioElements.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }
}
