import { Assets, Container } from "pixi.js";
import type { Engine } from "../engine/Engine";
import { PlayerMovement } from "./playerMovement";
import { PlayerSprite } from "./PlayerSprite";

export class Player {
  sprite?: PlayerSprite;
  readonly movement: PlayerMovement;

  inventory: Record<string, number> = {};

  get body() {
    return this.movement.body;
  }

  constructor(readonly engine: Engine) {
    Assets.load("player_spritesheet.json").then((sheet) => {
      this.sprite = new PlayerSprite(sheet);
    });

    this.movement = new PlayerMovement(
      engine.physicsEngine,
      (id: string) => {
        this._addToInventory(id);
      },
      100,
      100
    );
  }

  addTo(container: Container, index = 0) {
    this.sprite?.addTo(container, index);
  }

  update(input: { left: boolean; right: boolean; jump: boolean }) {
    this.movement.update(input);
  }

  syncWithPhysics() {
    this.sprite?.update(
      this.body.position.x,
      this.body.position.y,
      this.body.velocity.x,
      this.body.velocity.y,
      this.movement.isOnGround()
    );
  }

  private _addToInventory(id: string) {
    if (id in this.inventory) {
      this.inventory[id] = this.inventory[id] + 1;
    } else {
      this.inventory[id] = 1;
    }

    console.log(this.inventory);
  }
}
