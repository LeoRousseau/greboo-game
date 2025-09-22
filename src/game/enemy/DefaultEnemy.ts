import { Container, Graphics } from "pixi.js";
import type { IPoint } from "../types/IPoint";
import Matter from "matter-js";
import type { Engine } from "../engine/Engine";

export class DefaultEnemy {
  readonly points: [IPoint, IPoint];
  readonly sprite: Graphics;
  readonly body: Matter.Body;
  facingPointIndex = 1;

  speed: number = 0.6;

  constructor(
    readonly engine: Engine,
    points: [IPoint, IPoint]
  ) {
    this.points = points;

    this.sprite = new Graphics();
    this.sprite.beginFill(0xff0000);
    this.sprite.drawEllipse(0, 0, 15, 20);
    this.sprite.endFill();

    this.body = Matter.Bodies.rectangle(points[0].x, points[0].y, 25, 40, {
      restitution: 0,
      friction: 0.1,
      inertia: Infinity,
      label: "enemy",
    });
    Matter.World.add(this.engine.physicsWorld, this.body);
  }

  addTo(container: Container, index = 0) {
    container.addChildAt(this.sprite, index);
  }

  update() {
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
  }
}
