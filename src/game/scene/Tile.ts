import { Graphics, Container } from "pixi.js";

export class Tile {
  public sprite: Graphics;

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {
    this.sprite = new Graphics();
    this.sprite.beginFill(0x00ff00);
    this.sprite.drawRect(0, 0, width, height);
    this.sprite.endFill();
    this.sprite.x = x;
    this.sprite.y = y;
  }

  addTo(container: Container) {
    container.addChild(this.sprite);
  }
}
