import { Container } from "pixi.js";
import { Player } from "./player";
import type { IPoint } from "../types/IPoint";

export class Camera {
  constructor(
    public player: Player,
    public container: Container,
    public renderSize: IPoint,
    public minY: number = -2200,
    public maxY: number = 1000
  ) {}

  update() {
    if (!this.player.sprite) return;
    this.container.x = -this.player.sprite.x + this.renderSize.x / 2;
    let targetY = -this.player.sprite.y + this.renderSize.y / 2;

    if (targetY < this.minY) targetY = this.minY;
    if (targetY > this.maxY) targetY = this.maxY;

    this.container.y = targetY;
  }
}
