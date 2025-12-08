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

  // Blink while invulnerable
  private blinkFrame = 0;
  private blinkFrameThreshold = 8; // toggle every ~8 frames
  private wasInvulnerable = false;

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

  public update(
    x: number,
    y: number,
    dx: number,
    _dy: number,
    onGround: boolean,
    isDead: boolean,
    invulnerable: boolean = false
  ) {
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

    // Pixel-perfect positioning to avoid glitching/blurring
    this.sprite.x = (x + 0.5) | 0;
    this.sprite.y = (y + 0.5) | 0;

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

    // Handle invulnerability blink
    if (invulnerable) {
      this.blinkFrame++;
      if (this.blinkFrame >= this.blinkFrameThreshold) {
        this.sprite.visible = !this.sprite.visible;
        this.blinkFrame = 0;
      }
      this.wasInvulnerable = true;
    } else if (this.wasInvulnerable) {
      // Reset visibility when invulnerability ends
      this.sprite.visible = true;
      this.blinkFrame = 0;
      this.wasInvulnerable = false;
    }
  }
}
