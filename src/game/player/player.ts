import { Graphics, Container } from "pixi.js";

export class Player {
  public sprite: Graphics;
  public x = 0;
  public y = 0;
  public vx = 0;
  public vy = 0;

  private gravity = 1;
  private speed = 5;
  private jumpStrength = -12;
  private onGround = false;

  constructor() {
    this.sprite = new Graphics();
    this.sprite.beginFill(0xff0000);
    this.sprite.drawCircle(0, 0, 20);
    this.sprite.endFill();
  }

  addTo(container: Container) {
    container.addChild(this.sprite);
    this.updateSprite();
  }

  updateSprite() {
    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }

  update(
    input: { left: boolean; right: boolean; jump: boolean },
    tiles: { x: number; y: number; width: number; height: number }[]
  ) {
    // horizontal
    if (input.left) this.vx = -this.speed;
    else if (input.right) this.vx = this.speed;
    else this.vx = 0;

    // vertical
    if (input.jump && this.onGround) {
      this.vy = this.jumpStrength;
      this.onGround = false;
    }

    this.vy += this.gravity;

    this.x += this.vx;
    this.y += this.vy;

    // collision simple avec le sol (tiles)
    this.onGround = false;
    for (const tile of tiles) {
      const playerBottom = this.y + 20;
      const playerTop = this.y - 20;
      const playerLeft = this.x - 20;
      const playerRight = this.x + 20;

      const tileTop = tile.y;
      const tileBottom = tile.y + tile.height;
      const tileLeft = tile.x;
      const tileRight = tile.x + tile.width;

      if (playerBottom > tileTop && playerTop < tileBottom && playerRight > tileLeft && playerLeft < tileRight) {
        // collision par le bas
        if (this.vy > 0 && playerBottom - this.vy <= tileTop) {
          this.y = tileTop - 20;
          this.vy = 0;
          this.onGround = true;
        }
      }
    }

    this.updateSprite();
  }
}
