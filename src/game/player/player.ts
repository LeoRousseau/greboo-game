import { Graphics, Container } from "pixi.js";
import type { Engine } from "../engine/Engine";
import Matter from "matter-js";

export class Player {
  readonly sprite: Graphics;
  readonly body: Matter.Body;

  readonly footSensor: Matter.Body;

  isOnGround = false;
  jumpsLeft = 2;
  maxJumps = 2;

  constructor(readonly engine: Engine) {
    this.sprite = new Graphics();
    this.sprite.beginFill(0xff0000);
    this.sprite.drawEllipse(0, 0, 15, 30);
    this.sprite.endFill();

    const body = Matter.Bodies.rectangle(100, 100, 25, 60, {
      restitution: 0,
      friction: 0.1,
      inertia: Infinity, // disable rotation
    });

    this.footSensor = Matter.Bodies.rectangle(100, 130, 20, 8, {
      isSensor: true,
      isStatic: false,
    });

    this.body = Matter.Body.create({
      parts: [body, this.footSensor],
    });

    Matter.Body.setCentre(this.body, { x: 100, y: 100 });

    Matter.Events.on(engine.physicsEngine, "collisionActive", (event) => {
      const footCollisions = event.pairs.some(
        (p) => p.bodyA.id === this.footSensor.id || p.bodyB.id === this.footSensor.id
      );
      this._setToGround(footCollisions);
    });
  }

  addTo(container: Container, index = 0) {
    container.addChildAt(this.sprite, index);
  }

  update(input: { left: boolean; right: boolean; jump: boolean }) {
    const speed = 2;

    // déplacement horizontal
    if (input.left) {
      Matter.Body.setVelocity(this.body, { x: -speed, y: this.body.velocity.y });
    }
    if (input.right) {
      Matter.Body.setVelocity(this.body, { x: speed, y: this.body.velocity.y });
    }

    // saut (si il reste des sauts)
    if (input.jump && this.jumpsLeft > 0) {
      Matter.Body.setVelocity(this.body, { x: this.body.velocity.x, y: 0 }); // reset vitesse verticale
      Matter.Body.applyForce(this.body, this.body.position, { x: 0, y: -0.04 });
      this.jumpsLeft--;
    }
  }

  syncWithPhysics() {
    this.sprite.x = this.body.position.x;
    this.sprite.y = this.body.position.y;
  }

  _setToGround(value: boolean) {
    if (this.isOnGround === value) return;
    console.log("set to ground", value);
    this.isOnGround = value;
    if (value) {
      this.jumpsLeft = this.maxJumps; // reset sauts
    }
  }
}
