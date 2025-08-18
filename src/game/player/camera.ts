import { Container } from "pixi.js";
import { Player } from "./player";

export class Camera {
  constructor(
    public player: Player,
    public container: Container
  ) {}

  update() {
    this.container.x = -this.player.x + window.innerWidth / 2;
    this.container.y = -this.player.y + window.innerHeight / 2;
  }
}
