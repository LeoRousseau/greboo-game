import * as PIXI from "pixi.js";
import type { IPoint } from "../types/IPoint";

export class Collectable {
  sprite?: PIXI.AnimatedSprite | PIXI.Sprite | PIXI.Graphics;

  private _container?: PIXI.Container;
  private _index?: number;

  constructor(pos: IPoint) {
    PIXI.Assets.load("pinecone_spritesheet.json").then((sheet) => {
      this.sprite = new PIXI.AnimatedSprite(sheet.animations.idle);
      if (this.sprite instanceof PIXI.AnimatedSprite) {
        this.sprite.animationSpeed = 0.1;
        this.sprite.play();
      }
      this.sprite.x = pos.x;
      this.sprite.y = pos.y;
      if (this._container && this._index) {
        this._container.addChildAt(this.sprite, this._index);
      }
    });
  }

  addTo(container: PIXI.Container, index = 0) {
    this._container = container;
    this._index = index;
    if (this.sprite) container.addChildAt(this.sprite, index);
  }
}
