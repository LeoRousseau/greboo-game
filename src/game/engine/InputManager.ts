export class InputManager {
  keys: Record<string, boolean> = {};
  used: Record<string, boolean> = {};

  joystickState: "neutral" | "left" | "right" = "neutral";

  private _joystickButtonPressed: boolean = false;
  private _joystickButtonUsed: boolean = false;

  set joystickButtonPressed(value: boolean) {
    this._joystickButtonPressed = value;
    if (!value) {
      this._joystickButtonUsed = false;
    }
  }

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

  isJoystickLeft() {
    return this.joystickState === "left";
  }

  isJoystickRight() {
    return this.joystickState === "right";
  }

  isJoystickButtonPressed() {
    return this._joystickButtonPressed;
  }

  onJoystickButtonPressed() {
    if (!this._joystickButtonPressed) return false;
    if (this._joystickButtonUsed) return false;
    this._joystickButtonUsed = true;
    return true;
  }
}
