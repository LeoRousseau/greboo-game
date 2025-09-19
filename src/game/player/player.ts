import { Graphics, Container } from "pixi.js";
import Matter from "matter-js";

export class Player {
  public sprite: Graphics;

  constructor(readonly body: Matter.Body) {
    this.sprite = new Graphics();
    this.sprite.beginFill(0xff0000);
    this.sprite.drawEllipse(0, 0, 15, 30);
    this.sprite.endFill();
  }

  addTo(container: Container, index = 0) {
    container.addChildAt(this.sprite, index);
  }

  update(input: { left: boolean; right: boolean; jump: boolean }) {
    const speed = 2;

    if (input.left) Matter.Body.setVelocity(this.body, { x: -speed, y: 0 });
    if (input.right) Matter.Body.setVelocity(this.body, { x: speed, y: 0 });

    if (input.jump && Math.abs(this.body.velocity.y) < 0.1) {
      Matter.Body.applyForce(this.body, this.body.position, { x: 0, y: -0.04 });
    }
  }

  syncWithPhysics() {
    console.log(this.body.position);
    this.sprite.x = this.body.position.x;
    this.sprite.y = this.body.position.y;
  }
}
