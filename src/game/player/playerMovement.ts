import Matter from "matter-js";

export class PlayerMovement {
  readonly body: Matter.Body;
  readonly footSensor: Matter.Body;

  private contacts = new Set<Matter.Body>(); // foot contacts

  private canDoubleJump = true;

  defaultSpeed = 2;
  jumpSpeed = 10;

  constructor(
    readonly engine: Matter.Engine,
    readonly onCollect: (key: string) => void,
    x: number,
    y: number
  ) {
    const body = Matter.Bodies.rectangle(x, y, 25, 68, {
      restitution: 0,
      friction: 0.1,
      inertia: Infinity, // disable rotation,
      label: "player",
    });

    this.footSensor = Matter.Bodies.rectangle(x, y + 35, 20, 8, {
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

        if (this.collideWithEnemy(pair) || this.collideWithProjectile(pair)) {
          console.log("DEATH");
        }

        if (this.collideWithCollectable(pair)) {
          const other = this.otherBody(pair);
          if ("collect" in other) {
            const key = (other as any).collect() as string;
            this.onCollect(key);
          }
        }

        if (this.collideWithTrap(pair)) {
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
    return pair.bodyA === this.footSensor || pair.bodyA === this.body ? pair.bodyB : pair.bodyA;
  }

  private collideWithEnemy(pair: Matter.Pair) {
    return (
      (pair.bodyA.label === "enemy" || pair.bodyB.label === "enemy") &&
      (pair.bodyA.label === "player" || pair.bodyB.label === "player")
    );
  }

  private collideWithProjectile(pair: Matter.Pair) {
    return (
      (pair.bodyA.label === "projectile" || pair.bodyB.label === "projectile") &&
      (pair.bodyA.label === "player" || pair.bodyB.label === "player")
    );
  }

  private collideWithCollectable(pair: Matter.Pair) {
    return (
      (pair.bodyA.label === "collectable" || pair.bodyB.label === "collectable") &&
      (pair.bodyA.label === "player" || pair.bodyB.label === "player")
    );
  }

  private collideWithTrap(pair: Matter.Pair) {
    return (
      (pair.bodyA.label === "trap" || pair.bodyB.label === "trap") &&
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
