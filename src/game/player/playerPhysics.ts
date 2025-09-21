import Matter from "matter-js";

export class PlayerPhysics {
  public body: Matter.Body;
  private engine: Matter.Engine;

  // Suivi des collisions
  private contacts = new Set<Matter.Body>();

  // Sauts
  private canDoubleJump = true;

  constructor(engine: Matter.Engine, x: number, y: number) {
    this.engine = engine;

    // Corps du joueur
    this.body = Matter.Bodies.rectangle(x, y, 30, 60, {
      friction: 0.0,
      frictionStatic: 10.0,
      restitution: 0,
    });

    Matter.World.add(this.engine.world, this.body);

    // Écoute les collisions
    Matter.Events.on(this.engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        if (this.isBodyInPair(pair)) {
          const other = this.otherBody(pair);
          this.contacts.add(other);
        }
      });
    });

    Matter.Events.on(this.engine, "collisionEnd", (event) => {
      event.pairs.forEach((pair) => {
        if (this.isBodyInPair(pair)) {
          const other = this.otherBody(pair);
          this.contacts.delete(other);
        }
      });
    });
  }

  // Utilitaire : savoir si une paire concerne le joueur
  private isBodyInPair(pair: Matter.Pair) {
    return pair.bodyA === this.body || pair.bodyB === this.body;
  }

  // Utilitaire : récupérer l’autre body
  private otherBody(pair: Matter.Pair) {
    return pair.bodyA === this.body ? pair.bodyB : pair.bodyA;
  }

  // --- Public API ---

  isOnGround(): boolean {
    return this.contacts.size > 0;
  }

  update(input: { left: boolean; right: boolean; jump: boolean }) {
    const speed = 2;

    // Déplacement gauche/droite
    if (input.left) Matter.Body.setVelocity(this.body, { x: -speed, y: this.body.velocity.y });
    if (input.right) Matter.Body.setVelocity(this.body, { x: speed, y: this.body.velocity.y });

    // Gestion du saut
    if (input.jump) {
      if (this.isOnGround()) {
        // Premier saut
        Matter.Body.setVelocity(this.body, { x: this.body.velocity.x, y: -8 });
        this.canDoubleJump = true;
      } else if (this.canDoubleJump) {
        // Double saut
        Matter.Body.setVelocity(this.body, { x: this.body.velocity.x, y: -8 });
        this.canDoubleJump = false;
      }
    }
  }
}
