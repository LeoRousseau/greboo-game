import { Container } from "pixi.js";
import { drawCollisionDebug } from "./collision";
import type { Game } from "../game/Game";

export class DebugController {
  debugContainer: Container;

  _collisionDisplayed = false;

  constructor(readonly game: Game) {
    this.debugContainer = new Container();
    this.game.currentLevel.content.addChild(this.debugContainer);
  }

  toggleCollision() {
    this._collisionDisplayed = !this._collisionDisplayed;
    this.displayCollision(this._collisionDisplayed);
  }

  displayCollision(value: boolean) {
    if (value) drawCollisionDebug(this.debugContainer, this.game.currentLevel.collisionData);
    else this.debugContainer.removeChildren();
  }
}
