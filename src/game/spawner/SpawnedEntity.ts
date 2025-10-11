import type { IPoint } from "../types/IPoint";
import * as PIXI from "pixi.js";
import Matter, { Bodies, Body, World, Events } from "matter-js";

export class SpawnedEntity {
  public sprite: PIXI.Sprite;
  public body?: Matter.Body;
  destroyed = false;

  constructor(
    readonly engine: Matter.Engine,
    readonly pos: IPoint,
    readonly velocity: IPoint,
    spriteUrl: string
  ) {
    PIXI.Assets.load(spriteUrl).then((t) => {
      this.sprite.texture = t;
      const width = this.sprite.width;
      const height = this.sprite.height;
      this.body = Bodies.rectangle(pos.x, pos.y, width, height, {
        restitution: 0.2,
        friction: 0.8,
        mass: 0,
        label: "projectile",
      });

      World.add(this.engine.world, this.body);
      Body.setVelocity(this.body, velocity);
    });
    this.sprite = new PIXI.Sprite();

    this.sprite.anchor.set(0.5);
    this.sprite.x = pos.x;
    this.sprite.y = pos.y;

    Events.on(this.engine, "collisionStart", (event) => {
      if (this.destroyed) return;

      for (const pair of event.pairs) {
        if (pair.bodyA === this.body || pair.bodyB === this.body) {
          this.destroy();
          break;
        }
      }
    });
  }

  addTo(container: PIXI.Container, index = 0) {
    container.addChildAt(this.sprite, index);
  }

  update() {
    if (this.destroyed || !this.body) return;
    Body.setVelocity(this.body, this.velocity);

    this.sprite.x = this.body.position.x;
    this.sprite.y = this.body.position.y;
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;

    if (this.body) World.remove(this.engine.world, this.body);
    this.sprite.removeFromParent();
    this.sprite.destroy();
  }
}
