import { Graphics, Container } from "pixi.js";
import type { Engine } from "../engine/Engine";
import { PlayerMovement } from "./playerMovement";

export class Player {
  readonly sprite: Graphics;
  readonly movement: PlayerMovement;

  get body() {
    return this.movement.body;
  }

  constructor(readonly engine: Engine) {
    this.sprite = new Graphics();
    this.sprite.beginFill(0xff0000);
    this.sprite.drawEllipse(0, 0, 15, 30);
    this.sprite.endFill();

    this.movement = new PlayerMovement(engine.physicsEngine, 100, 100);
  }

  addTo(container: Container, index = 0) {
    container.addChildAt(this.sprite, index);
  }

  update(input: { left: boolean; right: boolean; jump: boolean }) {
    this.movement.update(input);
  }

  syncWithPhysics() {
    this.sprite.x = this.body.position.x;
    this.sprite.y = this.body.position.y;
  }
}
