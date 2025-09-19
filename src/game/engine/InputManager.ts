export class InputManager {
  keys: Record<string, boolean> = {};
  used: Record<string, boolean> = {};

  constructor() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
    });
    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
      this.used[e.code] = false;
    });
  }

  isDown(key: string) {
    return !!this.keys[key];
  }

  onDown(key: string) {
    if (!this.keys[key]) return false;
    if (this.used[key]) return false;
    this.used[key] = true;
    return true;
  }
}
