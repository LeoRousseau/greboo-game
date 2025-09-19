import Matter from "matter-js";
import type { Engine } from "../engine/Engine";
import { Player } from "../player/player";
import { Level } from "../scene/Level";

export class Game {
  currentLevel: Level;
  player: Player;

  constructor(readonly engine: Engine) {
    this.player = new Player(engine);
    Matter.World.addBody(this.engine.physicsWorld, this.player.body);
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
