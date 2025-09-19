import type { Engine } from "../engine/Engine";
import { Player } from "../player/player";
import { Level } from "../scene/Level";

export class Game {
  currentLevel: Level;
  player: Player;

  constructor(readonly engine: Engine) {
    this.player = new Player();
    this.currentLevel = new Level(engine.application, engine.world, this.player);
    this.loadLevel();
  }

  loadLevel() {
    this.engine.application.ticker.add(() => {
      this.currentLevel.update();
    });
  }

  start() {
    this.engine.start();
  }
}
