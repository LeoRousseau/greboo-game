import Matter from "matter-js";

export class PlayerMovement {
  readonly body: Matter.Body;
  readonly footSensor: Matter.Body;
  readonly engine: Matter.Engine;

  // Suivi des collisions
  private contacts = new Set<Matter.Body>();

  // Sauts
  private canDoubleJump = true;

  constructor(engine: Matter.Engine, x: number, y: number) {
    this.engine = engine;

    const body = Matter.Bodies.rectangle(100, 100, 25, 60, {
      restitution: 0,
      friction: 0.1,
      inertia: Infinity, // disable rotation,
    });

    this.footSensor = Matter.Bodies.rectangle(100, 130, 20, 8, {
      isSensor: true,
      isStatic: false,
    });

    this.body = Matter.Body.create({
      parts: [body, this.footSensor],
    });

    Matter.Body.setCentre(this.body, { x: 100, y: 100 });

    // Écoute les collisions
    Matter.Events.on(this.engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        if (this.areFootInPair(pair)) {
          const other = this.otherBody(pair);
          this.contacts.add(other);
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

  isOnGround(): boolean {
    return this.contacts.size > 0;
  }

  update(input: { left: boolean; right: boolean; jump: boolean }) {
    const speed = 2;

    // Déplacement gauche/droite
    if (input.left) Matter.Body.setVelocity(this.body, { x: -speed, y: this.body.velocity.y });
    if (input.right) Matter.Body.setVelocity(this.body, { x: speed, y: this.body.velocity.y });

    if (input.jump) {
      if (this.isOnGround()) {
        Matter.Body.setVelocity(this.body, { x: this.body.velocity.x, y: -8 });
        this.canDoubleJump = true;
      } else if (this.canDoubleJump) {
        Matter.Body.setVelocity(this.body, { x: this.body.velocity.x, y: -8 });
        this.canDoubleJump = false;
      }
    }
  }
}
