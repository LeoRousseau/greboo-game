import * as PIXI from "pixi.js";
import type { IPoint } from "../types/IPoint";
import Matter from "matter-js";
import type { Engine } from "../engine/Engine";

export class Collectable {
  sprite?: PIXI.AnimatedSprite;
  body?: Matter.Body;

  private _container?: PIXI.Container;
  private _index?: number;
  constructor(
    readonly engine: Engine,
    readonly key: string,
    pos: IPoint,
    spritesheet: string
  ) {
    PIXI.Assets.load(spritesheet).then((sheet) => {
      this.sprite = new PIXI.AnimatedSprite(sheet.animations.idle);
      this.sprite.animationSpeed = 0.1;
      this.sprite.play();
      this.sprite.anchor.set(0.5);
      this.sprite.x = pos.x;
      this.sprite.y = pos.y;
      if (this._container && this._index) {
        this._container.addChildAt(this.sprite, this._index);
      }

      this.body = Matter.Bodies.rectangle(pos.x, pos.y, 25, 35, {
        isSensor: true,
        isStatic: true,
        label: "collectable",
      });
      Matter.World.add(this.engine.physicsWorld, this.body);
      (this.body as any).collect = () => this.collect();
    });
  }

  addTo(container: PIXI.Container, index = 0) {
    this._container = container;
    this._index = index;
    if (this.sprite) container.addChildAt(this.sprite, index);
  }

  collect(): string {
    if (this.body) Matter.World.remove(this.engine.physicsWorld, this.body);
    if (this.sprite && this._container) this._container.removeChild(this.sprite);
    return this.key;
  }
}
