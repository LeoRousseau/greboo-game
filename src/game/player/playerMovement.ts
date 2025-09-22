import Matter from "matter-js";

export class PlayerMovement {
  readonly body: Matter.Body;
  readonly footSensor: Matter.Body;
  readonly engine: Matter.Engine;

  private contacts = new Set<Matter.Body>(); // foot contacts

  private canDoubleJump = true;

  defaultSpeed = 2;
  jumpSpeed = 10;

  constructor(engine: Matter.Engine, x: number, y: number) {
    this.engine = engine;

    const body = Matter.Bodies.rectangle(x, y, 25, 60, {
      restitution: 0,
      friction: 0.1,
      inertia: Infinity, // disable rotation,
      label: "player",
    });

    this.footSensor = Matter.Bodies.rectangle(x, y + 30, 20, 8, {
      isSensor: true,
      isStatic: false,
      label: "player",
    });

    this.body = Matter.Body.create({
      parts: [body, this.footSensor],
    });

    Matter.Body.setCentre(this.body, { x: 100, y: 100 });

    Matter.Events.on(this.engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        if (this.areFootInPair(pair)) {
          const other = this.otherBody(pair);
          this.contacts.add(other);
        }

        if (this.collideWithEnemy(pair)) {
          console.log("DEATH");
        }
      });
    });

    Matter.Events.on(this.engine, "collisionEnd", (event) => {
      event.pairs.forEach((pair) => {
        if (this.areFootInPair(pair)) {
          const other = this.otherBody(pair);
          this.contacts.delete(other);
        }
      });
    });
  }

  private areFootInPair(pair: Matter.Pair) {
    return pair.bodyA === this.footSensor || pair.bodyB === this.footSensor;
  }

  private otherBody(pair: Matter.Pair) {
    return pair.bodyA === this.footSensor ? pair.bodyB : pair.bodyA;
  }

  private collideWithEnemy(pair: Matter.Pair) {
    return (
      (pair.bodyA.label === "enemy" || pair.bodyB.label === "enemy") &&
      (pair.bodyA.label === "player" || pair.bodyB.label === "player")
    );
  }

  isOnGround(): boolean {
    return this.contacts.size > 0;
  }

  update(input: { left: boolean; right: boolean; jump: boolean }) {
    if (input.left) Matter.Body.setVelocity(this.body, { x: -this.defaultSpeed, y: this.body.velocity.y });
    if (input.right) Matter.Body.setVelocity(this.body, { x: this.defaultSpeed, y: this.body.velocity.y });

    if (input.jump) {
      if (this.isOnGround()) {
        Matter.Body.setVelocity(this.body, { x: this.body.velocity.x, y: -this.jumpSpeed });
        this.canDoubleJump = true;
      } else if (this.canDoubleJump) {
        Matter.Body.setVelocity(this.body, { x: this.body.velocity.x, y: -this.jumpSpeed });
        this.canDoubleJump = false;
      }
    }
  }
}
