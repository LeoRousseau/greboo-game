import * as PIXI from "pixi.js";
import type { IPoint } from "../types/IPoint";
import Matter from "matter-js";
import type { Engine } from "../engine/Engine";
import { AssetManager } from "../assets/AssetManager";

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
    // Utiliser le gestionnaire d'assets
    const sheet = AssetManager.getInstance().getSpritesheet(spritesheet as any);
    if (sheet) {
      this.sprite = new PIXI.AnimatedSprite(sheet.animations.idle);
      this.sprite.animationSpeed = 0.1;
      this.sprite.play();
      this.sprite.anchor.set(0.5);
      // Snap collectable to integer pixel positions to avoid subpixel blurring
      this.sprite.x = Math.round(pos.x);
      this.sprite.y = Math.round(pos.y);
      // Prefer nearest filtering for this sprite's base texture when available
      try {
        const base = (this.sprite.texture as any).baseTexture;
        if (base) base.scaleMode = (PIXI as any).SCALE_MODES ? (PIXI as any).SCALE_MODES.NEAREST : base.scaleMode;
      } catch {}
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
    } else {
      console.warn("pinecone_spritesheet non disponible");
    }
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
