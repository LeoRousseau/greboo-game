import Matter from "matter-js";
import type { Engine } from "../engine/Engine";
import { Player } from "../player/player";
import { Level } from "../scene/Level";
import { Scoreboard } from "./Scoreboard";

export class Game {
  currentLevel: Level;
  player: Player;
  scoreboard: Scoreboard;

  constructor(readonly engine: Engine) {
    this.player = new Player(engine);
    Matter.World.addBody(this.engine.physicsWorld, this.player.body);
    this.currentLevel = new Level(engine, engine.world, this.player);
    this.scoreboard = new Scoreboard(engine.application);
    this.loadLevel();
  }

  loadLevel() {
    this.engine.application.ticker.add((ticker) => {
      this.currentLevel.update(ticker);
      this.scoreboard.update(ticker, this.player.inventory);

      Matter.Engine.update(this.engine.physicsEngine, 1000 / 60);
      this.currentLevel.syncWithPhysics();
    });
  }

  start() {
    this.engine.start();
  }
}
