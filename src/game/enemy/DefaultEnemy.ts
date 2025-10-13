import { AnimatedSprite, Assets, Container } from "pixi.js";
import type { IPoint } from "../types/IPoint";
import Matter from "matter-js";
import type { Engine } from "../engine/Engine";

export class DefaultEnemy {
  readonly points: [IPoint, IPoint];
  sprite?: AnimatedSprite;
  readonly body: Matter.Body;
  facingPointIndex = 1;

  speed: number = 0.4;

  private _container?: Container;
  private _index?: number;

  constructor(
    readonly engine: Engine,
    points: [IPoint, IPoint]
  ) {
    this.points = points;

    Assets.load("ghost_spritesheet.json").then((sheet) => {
      console.log(sheet);
      this.sprite = new AnimatedSprite(sheet.animations.walk);
      this.sprite.animationSpeed = 0.15;
      this.sprite.play();
      this.sprite.anchor.set(0.5);
      this.sprite.x = points[0].x;
      this.sprite.y = points[0].y;

      if (this._container && this._index) {
        this._container.addChildAt(this.sprite, this._index);
      }
    });

    this.body = Matter.Bodies.rectangle(points[0].x, points[0].y, 25, 40, {
      restitution: 0,
      friction: 0.1,
      inertia: Infinity,
      label: "enemy",
    });
    Matter.World.add(this.engine.physicsWorld, this.body);
  }

  addTo(container: Container, index = 0) {
    this._container = container;
    this._index = index;
    if (this.sprite) container.addChildAt(this.sprite, index);
  }

  update() {
    if (!this.sprite) return;

    const target = this.points[this.facingPointIndex];
    const distance = target.x - this.body.position.x;
    if (Math.abs(distance) < 5) {
      this.facingPointIndex = Math.abs(1 - this.facingPointIndex);
      return;
    }
    Matter.Body.setVelocity(this.body, {
      x: Math.sign(target.x - this.body.position.x) * this.speed,
      y: this.body.velocity.y,
    });

    this.sprite.x = this.body.position.x;
    this.sprite.y = this.body.position.y;

    this.sprite.scale.x = this.body.velocity.x > 0 ? 1 : -1;
  }
}
