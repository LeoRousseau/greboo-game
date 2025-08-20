import { Container } from "pixi.js";
import { Player } from "./player";

export class Camera {
  constructor(
    public player: Player,
    public container: Container,
    public minY: number = -200,
    public maxY: number = 1000
  ) {}

  update() {
    this.container.x = -this.player.x + window.innerWidth / 2;
    let targetY = -this.player.y + window.innerHeight / 2;

    if (targetY < this.minY) targetY = this.minY;
    if (targetY > this.maxY) targetY = this.maxY;

    this.container.y = targetY;
  }
}
