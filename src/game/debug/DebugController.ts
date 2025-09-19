import { Container } from "pixi.js";
import { drawCollisionDebug, drawPhysicsCollisionDebug } from "./collision";
import type { Game } from "../game/Game";

export class DebugController {
  debugContainer: Container;

  _collisionDisplayed = false;
  _physicsCollisionDisplayed = false;

  constructor(readonly game: Game) {
    this.debugContainer = new Container();
    this.game.currentLevel.content.addChild(this.debugContainer);
  }

  toggleCollision() {
    this._collisionDisplayed = !this._collisionDisplayed;
    this.displayCollision(this._collisionDisplayed);
  }

  togglePhysicsCollision() {
    this._physicsCollisionDisplayed = !this._physicsCollisionDisplayed;
    this.displayPhysicsCollision(this._physicsCollisionDisplayed);
  }

  displayCollision(value: boolean) {
    if (value) drawCollisionDebug(this.debugContainer, this.game.currentLevel.collisionData);
    else this.debugContainer.removeChildren();
  }

  displayPhysicsCollision(value: boolean) {
    if (value) drawPhysicsCollisionDebug(this.debugContainer, this.game.engine.physicsWorld);
    else this.debugContainer.removeChildren();
  }
}
