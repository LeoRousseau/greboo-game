import Matter from "matter-js";

export class PlayerMovement {
  readonly body: Matter.Body;
  readonly footSensor: Matter.Body;

  private contacts = new Set<Matter.Body>(); // foot contacts

  private canDoubleJump = true;

  defaultSpeed = 6;
  jumpSpeed = 13;

  constructor(
    readonly engine: Matter.Engine,
    readonly onCollect: (key: string) => void,
    readonly onDeath: () => void,
    readonly onJump: () => void,
    x: number,
    y: number
  ) {
    // Torso (no friction so it won't stick to walls)
    const torso = Matter.Bodies.rectangle(x, y, 22, 64, {
      restitution: 0,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      inertia: Infinity, // disable rotation
      label: "player-torso",
    });

    // Physical foot part with friction to interact with ground
    const foot = Matter.Bodies.rectangle(x, y + 21, 12, 40, {
      isSensor: false,
      restitution: 0,
      friction: 0.6,
      frictionStatic: 0.6,
      frictionAir: 0,
      label: "player-foot",
    });

    // Small foot sensor used only for reliable ground detection
    this.footSensor = Matter.Bodies.rectangle(x, y + 21, 20, 40, {
      isSensor: true,
      isStatic: false,
      label: "player-foot-sensor",
    });

    // Compose the player from torso + physical foot + sensor
    this.body = Matter.Body.create({
      parts: [torso, foot, this.footSensor],
      label: "player",
    });

    // Ensure parts have the intended friction values (safety)
    try {
      this.body.parts?.forEach((p: any) => {
        if (p.label === "player-foot") {
          p.friction = 0.6;
          p.frictionStatic = 0.6;
          p.frictionAir = 0;
        } else {
          p.friction = 0;
          p.frictionStatic = 0;
          p.frictionAir = 0;
        }
      });
    } catch {}

    // NOTE: removed forced center offset to keep parts at their created positions
    Matter.Events.on(this.engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        if (this.areFootInPair(pair)) {
          const other = this.otherBody(pair);
          this.contacts.add(other);
        }

        if (this.collideWithEnemy(pair) || this.collideWithProjectile(pair)) {
          this.onDeath();
        }

        if (this.collideWithCollectable(pair)) {
          const other = this.otherBody(pair);
          if (other && "collect" in other) {
            const key = (other as any).collect() as string;
            this.onCollect(key);
          }
        }

        if (this.collideWithTrap(pair)) {
          this.onDeath();
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
      (pair.bodyA.label.includes("player") || pair.bodyB.label.includes("player"))
    );
  }

  private collideWithProjectile(pair: Matter.Pair) {
    return (
      (pair.bodyA.label === "projectile" || pair.bodyB.label === "projectile") &&
      (pair.bodyA.label.includes("player") || pair.bodyB.label.includes("player"))
    );
  }

  private collideWithCollectable(pair: Matter.Pair) {
    return (
      (pair.bodyA.label === "collectable" || pair.bodyB.label === "collectable") &&
      (pair.bodyA.label.includes("player") || pair.bodyB.label.includes("player"))
    );
  }

  private collideWithTrap(pair: Matter.Pair) {
    return (
      (pair.bodyA.label === "trap" || pair.bodyB.label === "trap") &&
      (pair.bodyA.label.includes("player") || pair.bodyB.label.includes("player"))
    );
  }

  isOnGround(): boolean {
    return this.contacts.size > 0;
  }

  update(input: { left: boolean; right: boolean; jump: boolean }) {
    console.log(this.body.velocity);
    if (input.left) Matter.Body.setVelocity(this.body, { x: -this.defaultSpeed, y: this.body.velocity.y });
    if (input.right) Matter.Body.setVelocity(this.body, { x: this.defaultSpeed, y: this.body.velocity.y });

    // If no horizontal input and player is on ground, stop horizontal movement to emulate friction
    if (!input.left && !input.right && this.isOnGround()) {
      Matter.Body.setVelocity(this.body, { x: 0, y: this.body.velocity.y });
    }

    if (input.jump) {
      console.log("Jump requested", this.isOnGround(), this.canDoubleJump);
      if (this.isOnGround()) {
        Matter.Body.setVelocity(this.body, { x: this.body.velocity.x, y: -this.jumpSpeed });
        this.canDoubleJump = true;
        this.onJump();
      } else if (this.canDoubleJump) {
        Matter.Body.setVelocity(this.body, { x: this.body.velocity.x, y: -this.jumpSpeed });
        this.canDoubleJump = false;
        this.onJump();
      }
    }
  }
}
