import { Container } from "pixi.js";
import type { Level } from "../scene/Level";
import type { Player } from "../player/player";
import type { Engine } from "../engine/Engine";
import { drawCollisionDebug } from "./collision";

export class DebugController {
  debugContainer: Container;

  _collisionDisplayed = false;

  constructor(
    readonly level: Level,
    readonly player: Player,
    readonly engine: Engine
  ) {
    this.debugContainer = new Container();
    this.level.content.addChild(this.debugContainer);
  }

  toggleCollision() {
    this._collisionDisplayed = !this._collisionDisplayed;
    this.displayCollision(this._collisionDisplayed);
  }

  displayCollision(value: boolean) {
    if (value) drawCollisionDebug(this.debugContainer, this.level.collisionData);
    else this.debugContainer.removeChildren();
  }
}
