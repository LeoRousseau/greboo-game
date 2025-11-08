import * as PIXI from "pixi.js";

export type PlayerState = "idle" | "run" | "death";

export class PlayerSprite {
  public sprite: PIXI.AnimatedSprite;
  private animations: Record<PlayerState, PIXI.Texture[]>;
  // Animation state stabilisation
  private currentState: PlayerState = "idle";
  private lastDetectedState: PlayerState = "idle";
  private stableStateFrameCount = 0;
  private stateStabilityThreshold = 2;

  // Facing direction stabilisation
  private facingLeft = false;
  private lastDetectedFacingLeft = false;
  private stableFacingFrameCount = 0;
  private facingStabilityThreshold = 2;

  get x() {
    return this.sprite.x;
  }
  get y() {
    return this.sprite.y;
  }

  constructor(sheet: PIXI.Spritesheet) {
    this.animations = {
      idle: sheet.animations["idle"],
      run: sheet.animations["run"],
      death: sheet.animations["death"],
    };

    // Sprite initial
    this.sprite = new PIXI.AnimatedSprite(this.animations.idle);
    this.sprite.anchor.set(0.5);

    this.sprite.animationSpeed = 0.15;
    this.sprite.play();
  }

  addTo(container: PIXI.Container, index = 0) {
    container.addChildAt(this.sprite, index);
  }

  public update(x: number, y: number, dx: number, _dy: number, onGround: boolean, isDead: boolean) {
    if (isDead) {
      if (this.currentState !== "death") {
        this.currentState = "death";
        this.sprite.textures = this.animations.death;
        this.sprite.loop = false;
        this.sprite.animationSpeed = 0.2;
        this.sprite.play();
      }
      return;
    }

    this.sprite.x = x;
    this.sprite.y = y;

    let detectedFacingLeft: boolean | null = null;
    if (dx < -0.01) detectedFacingLeft = true;
    else if (dx > 0.01) detectedFacingLeft = false;

    if (detectedFacingLeft !== null) {
      if (detectedFacingLeft === this.lastDetectedFacingLeft) {
        this.stableFacingFrameCount++;
      } else {
        this.stableFacingFrameCount = 1;
        this.lastDetectedFacingLeft = detectedFacingLeft;
      }

      if (this.stableFacingFrameCount >= this.facingStabilityThreshold && this.facingLeft !== detectedFacingLeft) {
        this.facingLeft = detectedFacingLeft;
        this.sprite.scale.x = this.facingLeft ? -1 : 1;
      }
    }

    let detectedState: PlayerState = "idle";
    if (!onGround) {
      detectedState = "run"; // "jump" deactivated
    } else if (Math.abs(dx) > 0.1) {
      detectedState = "run";
    }

    if (detectedState === this.lastDetectedState) {
      this.stableStateFrameCount++;
    } else {
      this.stableStateFrameCount = 1;
      this.lastDetectedState = detectedState;
    }

    if (this.stableStateFrameCount >= this.stateStabilityThreshold && this.currentState !== detectedState) {
      this.currentState = detectedState;
      this.sprite.textures = this.animations[this.currentState];
      this.sprite.play();
    }
  }
}
