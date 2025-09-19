import Matter from "matter-js";
import type { Engine } from "../engine/Engine";
import { Player } from "../player/player";
import { Level } from "../scene/Level";

export class Game {
  currentLevel: Level;
  player: Player;

  constructor(readonly engine: Engine) {
    const body = Matter.Bodies.rectangle(100, 100, 25, 60, {
      restitution: 0,
      friction: 0.1,
      inertia: Infinity, // disable rotation
    });
    this.player = new Player(body);
    Matter.World.addBody(this.engine.physicsWorld, body);
    this.currentLevel = new Level(engine, engine.world, this.player);
    this.loadLevel();
  }

  loadLevel() {
    this.engine.application.ticker.add(() => {
      this.currentLevel.update();

      Matter.Engine.update(this.engine.physicsEngine, 1000 / 60);
      this.currentLevel.syncWithPhysics();
    });
  }

  start() {
    this.engine.start();
  }
}
