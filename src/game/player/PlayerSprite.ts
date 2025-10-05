import * as PIXI from "pixi.js";

export type PlayerState = "idle" | "run" | "jump";

export class PlayerSprite {
  public sprite: PIXI.AnimatedSprite;
  private animations: Record<PlayerState, PIXI.Texture[]>;
  // Animation state stabilisation
  private currentState: "idle" | "run" | "jump" = "idle";
  private lastDetectedState: "idle" | "run" | "jump" = "idle";
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
      jump: sheet.animations["jump"],
    };

    // Sprite initial
    this.sprite = new PIXI.AnimatedSprite(this.animations.jump);
    this.sprite.scale.y *= 1.8;
    this.sprite.anchor.set(0.5);

    this.sprite.animationSpeed = 0.1;
    this.sprite.play();
  }

  addTo(container: PIXI.Container, index = 0) {
    container.addChildAt(this.sprite, index);
  }

  public update(x: number, y: number, dx: number, dy: number, onGround: boolean) {
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

    let detectedState: "idle" | "run" | "jump" = "idle";
    if (!onGround) {
      detectedState = "jump";
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
